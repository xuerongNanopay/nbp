import { NBPService } from "@/service/nbp/index.js"
import { PRISMAService } from "@/service/prisma/index.js"
import { ScotiaRTPService } from "@/service/scotia_rtp/index.js"
import { LOGGER } from "@/utils/logUtil.js"
import {PrismaTransaction, TRANSACTION_PROJET_TYPE} from "./index.d.js"
import { 
  CashIn, 
  CashInMethod, 
  CashInStatus, 
  Prisma, 
  TransactionStatus, 
  TransferStatus 
} from "@prisma/client"
import dayjs from "dayjs"
import { nbpProcessor } from "./nbp.js"
import { idmProcessor } from "./idm.js"
import { scotialRTPCashIn } from "./cash_in.js"

export const TRANSACTION_PROJECT = {
  id: true,
  status: true,
  cashIn: {
    select: {
      id: true,
      status: true,
      cashInReceiveAt: true,
      endInfo: true
    }
  },
  transfers: {
    orderBy: {
      id: Prisma.SortOrder.asc
    },
    select: {
      id: true,
      name: true,
      status: true,
      endInfo: true,
      next: {
        select: {
          id: true
        }
      }
    }
  },
  ownerId: true
}

// Initial cash in.
export async function initialCashIn(transactionId: number): Promise<CashIn> {

  const cashIn = await PRISMAService.$transaction(async (tx) => {
    await tx.$queryRaw`
      select id from transaction where id = ${transactionId} for update
    `
    const transaction = await tx.transaction.findUnique({
      where: {
        id: transactionId
      },
      select: {
        id: true,
        status: true,
        ownerId: true,
        sourceAccountId: true
      }
    })
    if (!transaction) throw new Error(`Transaction \`${transactionId}\` no found`)
    if (transaction.status !== TransactionStatus.INITIAL) throw new Error(`Transaction \`${transactionId}\` is not in initial status`)

    return await scotialRTPCashIn(tx, transaction.id)
  })
  if (_isCashInFinish(cashIn.status)) await processTransaction(cashIn.transactionId)
  return cashIn
}

// Once payment received processing the payment.
// IDM, NBP
// Previous status should initial next one.
export async function processTransaction(transactionId: number) {
  return await _processTransaction(transactionId)
}

async function _processTransaction(transactionId: number): Promise<number> {
  const MAX_LOOP = 8
  let i = 0
  let ret: boolean
  do {
    ret = await _tryProcessing(transactionId)
    i++
  } while(i <= MAX_LOOP && ret)

  if ( i > MAX_LOOP ) {
    LOGGER.error(`Transaction \`${transactionId}\` reach maximum loop \`${MAX_LOOP}\``)
  }
  return i
}

async function _tryProcessing(transactionId: number) {
  const transaction = await PRISMAService.transaction.findUnique({
    where: {
      id: transactionId
    },
    select: TRANSACTION_PROJECT
  })
  if (!transaction) throw new Error(`Transaction \`${transactionId}\` no found`)

  if ( 
    transaction.status === TransactionStatus.WAITING_FOR_PAYMENT
  ) {
    return await _cashInProcessor(transactionId)
  } else if (
    transaction.status == TransactionStatus.PROCESS &&
    !!transaction.transfers && 
    transaction.transfers.length === 1 &&
    transaction.transfers[0]!.name === 'IDM'
  ) {
    return await idmProcessor(transactionId)
  } else if (
    transaction.status == TransactionStatus.PROCESS &&
    !!transaction.transfers && 
    transaction.transfers.length === 2 &&
    transaction.transfers[1]!.name === 'NBP'
  ) {
    return await nbpProcessor(transactionId)
  } else {
    LOGGER.warn(
      'Transaction Processor', 
      `Transation \`${transactionId}\``, 
      `Transactions status: \`${transaction.status}\``,
      'No Processor found for current status'
    )
    return false
  }
}

// Finilizing CashIn and initial IDM.
async function _cashInProcessor(transactionId: number): Promise<boolean> {
  return await PRISMAService.$transaction(async (tx) => {
    await tx.$queryRaw`select id from transaction where id = ${transactionId} for update`
    const transaction = await tx.transaction.findUniqueOrThrow({
      where: {
        id: transactionId
      },
      select: TRANSACTION_PROJECT
    })    
    if (transaction.status !== TransactionStatus.WAITING_FOR_PAYMENT) {
      LOGGER.warn('Transaction CashIn Processor', `Transaction: \`${transaction.id}\` is out of Cash In processor scope`)
      return false
    }
    if (!transaction.cashIn) throw Error(`Transaction \`${transactionId}\` miss cash_in during Cash In processor`)

    if (transaction.cashIn.status === CashInStatus.COMPLETE) {
      const newTransaction = await tx.transaction.update({
        where: {
          id: transaction.id
        },
        data: {
          status: TransactionStatus.PROCESS,
          transfers: {
            create: [
              {
                status: TransferStatus.INITIAL,
                name: 'IDM',
                ownerId: transaction.ownerId
              }
            ]
          }
        },
        select: {
          id: true,
          status: true
        }
      })
      LOGGER.info('Transaction CashIn Processor', `Transation \`${transactionId}\``, `Cash In complete, Transaction status update to \`${newTransaction.status}\``)
      return true
    } else if (
      transaction.cashIn.status === CashInStatus.FAIL ||
      transaction.cashIn.status === CashInStatus.Cancel
    ) {
      await tx.transaction.update({
        where: {
          id: transaction.id
        },
        data: {
          status: TransactionStatus.REJECT,
          terminatedAt: new Date(),
          endInfo: transaction.cashIn.endInfo ?? 'Do not receive the payment'
        }
      })
      LOGGER.warn('Transaction CashIn Processor', `Transation \`${transactionId}\` Cash In failed.`)
      return true
    } else {
      LOGGER.warn('Transaction CashIn Processor', `No status change`, `Transaction: \`${transactionId}\` has CashIn Status: \`${transaction.cashIn.status}\``)
      return false
    }
  })
}

//Retry only available on the last transfer.
//And transfer status is FAIL.
async function retryTransaction(transactionId: number) {

}

async function cancelTransaction(transactionId: number) {
  //TODO: do not support now.
}

async function refundTransaction(transactionId: number) {
  return await PRISMAService.$transaction(async (tx) => {
    await tx.$queryRaw`select id from transaction where id = ${transactionId} for update`
    //TODO: create table for refund.
  })
}

export async function finalizeCashInStatusFromRTPPaymentId(paymentId: string) {
  const cashIn = await PRISMAService.cashIn.findFirst({
    where: {
      externalRef: paymentId
    },
    select: {
      id: true,
      status: true,
      transactionId: true
    }
  })
  if (!cashIn) {
    LOGGER.error('func: updateCashInStatusFromRTPPaymentId', `Cash In no found with externalRef == \`${paymentId}\``)
    throw new Error(`No associated record with payment_id: \`${paymentId}\``)
  }
  if (cashIn.status !== CashInStatus.WAIT) {
    LOGGER.warn('func: updateCashInStatusFromRTPPaymentId', `Cash In \`${cashIn.id}\` is not in \`${CashInStatus.WAIT}\` but \`${cashIn.status}\``)
    throw new Error(`Unable to process payment_id: \`${paymentId}\``)
  }

  const paymentDetails = await ScotiaRTPService.requestForPaymentDetails({paymentId: paymentId, transactionId: cashIn.transactionId})
  const paymentStatus = paymentDetails.data?.transaction_status ?? paymentDetails.data?.request_for_payment_status ?? null
  if (!paymentStatus) {
    LOGGER.error('func: updateCashInStatusFromRTPPaymentId', `Unable to fetch transaction status with paymentId \`${paymentId}\``)
    throw new Error(`Unable to fetch transaction status with paymentId \`${paymentId}\``)
  }

  const newCashInStatus = _cashInStatusMapper(paymentStatus as string)
  if ( newCashInStatus === CashInStatus.WAIT ) {
    LOGGER.info('func: updateCashInStatusFromRTPPaymentId', `CashIn \`${cashIn.id}\` still waiting`, `Fetch status: \`${paymentStatus}\``)
    return
  }
  const updateCashIn = await PRISMAService.$transaction(async (tx) => {
    await tx.$queryRaw`select id from cash_in where id = ${cashIn.id} for update`
    const oldCashIn = await tx.cashIn.findUniqueOrThrow({
      where: {
        id: cashIn.id
      },
      select: {
        id: true,
        status: true,
        transactionId: true
      }
    })
    if (oldCashIn.status !== CashInStatus.WAIT) {
      LOGGER.error('func: updateCashInStatusFromRTPPaymentId', `Expect CashIn \`${oldCashIn.id}\` status is \`${CashInStatus.WAIT}\`, but \`${oldCashIn.status}\``)
      throw new Error(`Expect CashIn status is \`${CashInStatus.WAIT}\`, but \`${oldCashIn.status}\``)
    }
    if ( newCashInStatus === CashInStatus.COMPLETE ) {
      const newCashIn = await tx.cashIn.update({
        where: {
          id: cashIn.id
        },
        data: {
          status: newCashInStatus,
          endInfo: 'Payment Completed.',
          cashInReceiveAt: new Date()
        },
        select: {
          id: true,
          status: true,
          transactionId: true
        }
      })
      LOGGER.info('func: updateCashInStatusFromRTPPaymentId', `CashIn \`${oldCashIn.id}\` change from \`${oldCashIn.status}\` to \`${newCashIn.status}\``)
      return newCashIn
    } else if (newCashInStatus === CashInStatus.Cancel || newCashInStatus === CashInStatus.FAIL) {
      const newCashIn = await tx.cashIn.update({
        where: {
          id: cashIn.id
        },
        data: {
          status: newCashInStatus,
          endInfo: newCashInStatus === CashInStatus.Cancel ? 'Payment Canceled.' : 'Payment failed.',
          cashInReceiveAt: new Date()
        },
        select: {
          id: true,
          status: true,
          transactionId: true
        }
      })
      LOGGER.error('func: updateCashInStatusFromRTPPaymentId', `CashIn \`${oldCashIn.id}\` change from \`${oldCashIn.status}\` to \`${newCashIn.status}\``)
      return newCashIn
    } else {
      LOGGER.error('func: updateCashInStatusFromRTPPaymentId', `CashIn \`${cashIn.id}\` reached Unspected state.`)
      throw new Error(`Unable to process CashIn \`${cashIn.id}\``)
    }
  })

  processTransaction(updateCashIn.transactionId)
}

async function _NBPInitialTransferInitial(
  tx: PrismaTransaction, 
  transactionId: number
) {
  const transaction = await tx.transaction.findUniqueOrThrow({
    where: {
      id: transactionId
    },
    select: {
      destinationAmount: true,
      transactionPurpose: true,
      owner: {
        select: {
          firstName: true,
          lastName: true,
          address1: true,
          address2: true,
          city: true,
          province: {
            select: {
              name: true
            }
          },
          countryCode: true,
          identification: {
            select: {
              type: true,
              value: true
            }
          }
        }
      },
      destinationContact: {
        select: {
          type: true,
          firstName: true,
          lastName: true,
          address1: true,
          address2: true,
          city: true,
          province: {
            select: {
              name: true
            }
          },
          countryCode: true,
          institution: {
            select: {
              abbr: true
            }
          },
          bankAccountNum: true,
          branchNum: true,
          iban: true,
        }
      }
    }
  })

  NBPService.loadRemittanceAccounts({
    Currency: 'PKR',
    Global_Id: 'TODO',
    Amount: transaction.destinationAmount/100.0,
    Pmt_Mode: 'ACCOUNT_TRANSFERS',
    Transaction_Date: dayjs().format('YYYY-MM-DD'),
    Remitter_Name: `${transaction.owner.firstName} ${transaction.owner.lastName}`,
    Remitter_Address: 'TODO',
    Remitter_Id_Type: 'DRIVING_LICENSE',
    Remitter_Id: 'DRIVING_LICENSE',
    Beneficiary_Name: 'TODO',
    Beneficiary_Address: 'aa',
    Beneficiary_Contact: 'TODO',
    Beneficiary_Bank: 'NBP',
    Beneficiary_Branch: 'TODO',
    Beneficiary_Account: 'TODO',
    Purpose_Remittance: 'TODO',
    Originating_Country: 'Canada'
  })
}

function _isTransactionTeminate(status: TransactionStatus) {
  return status === TransactionStatus.CANCEL || status === TransactionStatus.REFUND
}

function _isTransactionRefund(status: TransactionStatus) {
  return status === TransactionStatus.REFUND_IN_PROGRESS || status === TransactionStatus.REFUND
}

function _isCashInFinish(status: CashInStatus) {
  return status === CashInStatus.COMPLETE || status === CashInStatus.Cancel || status === CashInStatus.FAIL
}

function _cashInStatusMapper(status: string): CashInStatus {
  switch(status) {
    //ACTC - Accepted Technical Validation 
    //PDNG - Pending 
    case "ACCC":
    case "ACSP":
    case "COMPLETED":
    case "REALTIME_DEPOSIT_COMPLETED":
    case "DEPOSIT_COMPLETE":
      return CashInStatus.COMPLETE

    case "RJCT":
    case "DECLINED":
      return CashInStatus.FAIL

    case "FULFILLED":
    case "AVAILABLE_TO_BE_FULFILLED":
    case "INITIATED":
    case "PDNG":
      return CashInStatus.WAIT

    case "REALTIME_DEPOSIT_FAILED":
    case "DIRECT_DEPOSIT_FAILED":
      return CashInStatus.FAIL

    case "CANCELLED":
    case "EXPIRED":
      return CashInStatus.Cancel

    default:
      throw new Error(`Unsupport status \`${status}\``)
  }
}