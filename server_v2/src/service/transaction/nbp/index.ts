import { PRISMAService } from "@/service/prisma/index.js"
import { ScotiaRTPService } from "@/service/scotia_rtp/index.js"
import { LOGGER } from "@/utils/logUtil.js"
import { 
  CashIn, 
  CashInMethod, 
  CashInStatus, 
  Prisma, 
  PrismaClient, 
  TransactionStatus, 
  TransferStatus 
} from "@prisma/client"
import { DefaultArgs } from "@prisma/client/runtime/library.js"

type PrismaTransaction = Omit<PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">
type TRANSACTION_PROJET_TYPE = Prisma.TransactionGetPayload<{
  select: {
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
}>
const TRANSACTION_PROJECT = {
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

    return await _scotialRTPCashIn(tx, transaction.id)
  })
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
    return await _idmProcessor(transactionId)
  } else if (
    transaction.status == TransactionStatus.PROCESS &&
    !!transaction.transfers && 
    transaction.transfers.length === 2 &&
    transaction.transfers[1]!.name === 'NBP'
  ) {
    return await _nbpProcessor(transactionId)
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

async function _idmProcessor(transactionId: number): Promise<boolean> {
  return await PRISMAService.$transaction(async (tx) => {
    await tx.$queryRaw`select id from transaction where id = ${transactionId} for update`
    const transaction = await tx.transaction.findFirstOrThrow({
      where: {
        id: transactionId
      },
      select: TRANSACTION_PROJECT
    })
    if (!(
      transaction.status == TransactionStatus.PROCESS &&
      !!transaction.transfers && 
      transaction.transfers.length === 1 &&
      transaction.transfers[0]!.name === 'IDM'
    )) {
      LOGGER.warn('Transaction IDM Processor', `Transaction: \`${transaction.id}\` is out of IDM processor scope`)
      return false
    }

    const transfer = transaction.transfers[0]!
    switch (transfer.status) {
      case TransferStatus.INITIAL:
        return await _idmInitialProcessor(tx, transaction)
      case TransferStatus.COMPLETE:
        return await _idmCompleteProcessor(tx, transaction)
      case TransferStatus.CANCEL:
      case TransferStatus.FAIL:
        return await _idmTerminateProcessor(tx, transaction)
      default:
        LOGGER.warn('Transaction IDM Processor', `No status change`, `Transfer: \`${transfer.id}\` is in \`${transfer.status}\``)
        return false
    }
  })
}

// Call IDM, and set transfer to COMPLETE, FAIL, or WAIT base on response.
async function _idmInitialProcessor(
  tx: PrismaTransaction, 
  transaction: TRANSACTION_PROJET_TYPE
): Promise<boolean> {

  const transfer = transaction.transfers[0]!
  if (transfer.status !== TransferStatus.INITIAL) {
    LOGGER.error(`IDM Initial Processor`, `transaction \`${transaction.id}\``, `Unable to processor Transfer \`${transfer.id}\` with status \`${transfer.status}\``)
    throw new Error('Unsupport status')
  }

  //TODO: Call IDM. now we approve as default.

  await tx.transfer.update({
    where: {
      id: transfer.id
    },
    data: {
      status: TransferStatus.COMPLETE,
      completeAt: new Date()
    }
  })
  LOGGER.info(`IDM Initial Processor`, `transaction \`${transaction.id}\``, `Transfer \`${transfer.id}\` Initial Successfully.\``)
  return true
}

// IDM Complete, move to next step.
// Inital NBP transfer.
async function _idmCompleteProcessor(
  tx: PrismaTransaction, 
  transaction: TRANSACTION_PROJET_TYPE
): Promise<boolean> {

  const transfer = transaction.transfers[0]!
  if (transfer.status !== TransferStatus.COMPLETE) {
    LOGGER.error(`IDM Complete Processor`, `transaction \`${transaction.id}\``, `Unable to processor Transfer \`${transfer.id}\` with status \`${transfer.status}\``)
    throw new Error('Unsupport status')
  }

  await tx.transfer.update({
    where: {
      id: transfer.id
    },
    data: {
      next: {
        create: {
          status: TransferStatus.INITIAL,
          name: 'NBP',
          ownerId: transaction.ownerId,
          transactionId: transaction.id
        }
      }
    }
  })
  LOGGER.info(`IDM Complete Processor`, `transaction \`${transaction.id}\``, `Transfer \`${transfer.id}\` Complete Successfully.\``)
  return true
}

// IDM Fail or Cancel. Set the final state for transaction.
async function _idmTerminateProcessor(
  tx: PrismaTransaction, 
  transaction: TRANSACTION_PROJET_TYPE
): Promise<boolean> {
  const transfer = transaction.transfers[0]!
  if (
    transfer.status !== TransferStatus.CANCEL &&
    transfer.status !== TransferStatus.FAIL
  ) {
    LOGGER.error(`IDM Terminate Processor`, `Unable to processor Transfer \`${transfer.id}\` with status \`${transfer.status}\``)
    throw new Error('Unsupport status')
  }

  const updateTransaction = await tx.transaction.update({
    where: {
      id: transaction.id
    },
    data: {
      status: transfer.status === TransferStatus.CANCEL ? TransactionStatus.CANCEL : TransactionStatus.REJECT,
      endInfo: transfer.endInfo,
      terminatedAt: new Date()
    },
    select: {
      id: true,
      status: true
    }
  })
  LOGGER.warn(`IDM Terminate Processor`, `Transaction \`${transaction.id} terminated in \`${updateTransaction.status}\`.\``)
  return false
}

async function _nbpProcessor(transactionId: number): Promise<boolean> {
  return await PRISMAService.$transaction(async (tx) => {
    await tx.$queryRaw`select id from transaction where id = ${transactionId} for update`
    const transaction = await tx.transaction.findFirstOrThrow({
      where: {
        id: transactionId
      },
      select: TRANSACTION_PROJECT
    })
    if (!(
      transaction.status == TransactionStatus.PROCESS &&
      !!transaction.transfers && 
      transaction.transfers.length === 2 &&
      transaction.transfers[1]!.name === 'NBP'
    )) {
      LOGGER.warn('Transaction NBP Processor', `Transaction: \`${transaction.id}\` is out of NBP processor scope`)
      return false
    }

    const transfer = transaction.transfers[1]!
    switch (transfer.status) {
      case TransferStatus.INITIAL:
        return await _nbpInitialProcessor(tx, transaction)
      case TransferStatus.COMPLETE:
        return await _nbpCompleteProcessor(tx, transaction)
      case TransferStatus.CANCEL:
      case TransferStatus.FAIL:
        return await _nbpTerminateProcessor(tx, transaction)
      default:
        LOGGER.warn('Transaction NBP Processor', `No status change`, `Transfer: \`${transfer.id}\` is in \`${transfer.status}\``)
        return false
    }
  })
}

async function _nbpInitialProcessor(
  tx: PrismaTransaction, 
  transaction: TRANSACTION_PROJET_TYPE
): Promise<boolean> {
  const transfer = transaction.transfers[1]!
  if (transfer.status !== TransferStatus.INITIAL) {
    LOGGER.error(`NBP Initial Processor`, `transaction \`${transaction.id}\``, `Unable to processor Transfer \`${transfer.id}\` with status \`${transfer.status}\``)
    throw new Error('Unsupport status')
  }

  //TODO: call NBP
  await tx.transfer.update({
    where: {
      id: transfer.id
    },
    data: {
      status: TransferStatus.WAIT,
      waitAt: new Date()
    }
  })

  LOGGER.info(`NBP Complete Processor`, `transaction \`${transaction.id}\``, `Transfer \`${transfer.id}\` Initial Successfully.\``)
  return false
}

async function _nbpCompleteProcessor(
  tx: PrismaTransaction, 
  transaction: TRANSACTION_PROJET_TYPE
): Promise<boolean> {
  const transfer = transaction.transfers[1]!
  if (transfer.status !== TransferStatus.COMPLETE) {
    LOGGER.error(`NBP Complete Processor`, `transaction \`${transaction.id}\``, `Unable to processor Transfer \`${transfer.id}\` with status \`${transfer.status}\``)
    throw new Error('Unsupport status')
  }

  await tx.transaction.update({
    where: {
      id: transaction.id
    },
    data: {
      status: TransactionStatus.COMPLETE,
      completedAt: new Date(),
      endInfo: 'Complete Successfully.'
    }
  })
  LOGGER.info(`NBP Complete Processor`, `Transaction \`${transaction.id}\` completed sucessfully.`)
  return false
}

async function _nbpTerminateProcessor(
  tx: PrismaTransaction, 
  transaction: TRANSACTION_PROJET_TYPE
): Promise<boolean> {
  const transfer = transaction.transfers[1]!
  if (
    transfer.status !== TransferStatus.CANCEL &&
    transfer.status !== TransferStatus.FAIL
  ) {
    LOGGER.error(`NBP Terminate Processor`, `transaction \`${transaction.id}\``, `Unable to processor Transfer \`${transfer.id}\` with status \`${transfer.status}\``)
    throw new Error('Unsupport status')
  }

  const updateTransaction = await tx.transaction.update({
    where: {
      id: transaction.id
    },
    data: {
      status: transfer.status === TransferStatus.CANCEL ? TransactionStatus.CANCEL : TransactionStatus.REJECT,
      endInfo: transfer.endInfo,
      terminatedAt: new Date()
    },
    select: {
      id: true,
      status: true
    }
  })
  LOGGER.error(`NBP Terminate Processor`, `Transaction \`${transaction.id}\` terminated in \`${updateTransaction.status}\``)
  return false
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

//This function should not throw any Error.
async function _scotialRTPCashIn(
  tx: PrismaTransaction, 
  transactionId: number
) {
    const transaction = await tx.transaction.findUniqueOrThrow({
      where: {
        id: transactionId
      },
      select: {
        id: true,
        debitAmount: true,
        sourceAccountId: true,
        sourceAccount: {
          select: {
            email: true
          }
        },
        ownerId: true,
        owner: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    })
    let cashIn
    try {
      const requestPaymentResult = await ScotiaRTPService.requestForPayment({
        transactionId: transaction.id,
        create_date_time: new Date(),
        amount: transaction.debitAmount/100,
        debtor_email: transaction.sourceAccount.email,
        debtor_name: `${transaction.owner.firstName} ${transaction.owner.lastName}`
      })
      if (!!requestPaymentResult.data) {
        LOGGER.info('_scotialRTPCashIn', `Transaction \`${transaction.id}\` Scotial RTP CashIn initial success with payment_id: \`${requestPaymentResult.data.payment_id}\``)
        const requestPaymentStatusResult = await ScotiaRTPService.requestForPaymentStatus({paymentId: requestPaymentResult.data.payment_id!, transactionId: transaction.id})
        if (
          !!requestPaymentStatusResult.data && 
          requestPaymentStatusResult.data.length > 0
        ) {
          cashIn = await tx.cashIn.create({
            data: {
              status: CashInStatus.WAIT,
              method: CashInMethod.INTERAC,
              ownerId: Number(transaction.ownerId),
              transactionId: Number(transaction.id),
              paymentLink: requestPaymentStatusResult.data[0]?.gateway_url ?? null,
              externalRef: requestPaymentResult.data.payment_id,
              externalRef1: requestPaymentResult.data.clearing_system_reference,
              paymentAccountId: Number(transaction.sourceAccountId),
            }
          })
          return cashIn
        } else {
          let endInfo
          if ( !!requestPaymentStatusResult.notifications && requestPaymentStatusResult.notifications.length>0 ) {
            endInfo = `code: \`${requestPaymentStatusResult.notifications[0]?.code}\`, message: \`${requestPaymentStatusResult.notifications[0]?.message}\``
          }
          LOGGER.error('_scotialRTPCashIn', `Transaction \`${transaction.id}\` Scotial RTP CashIn initial failed.`, endInfo)
        }
      } else {
        let endInfo
        if ( !!requestPaymentResult.notifications && requestPaymentResult.notifications.length>0 ) {
          endInfo = `code: \`${requestPaymentResult.notifications[0]?.code}\`, message: \`${requestPaymentResult.notifications[0]?.message}\``
        }
        LOGGER.error('_scotialRTPCashIn', `Transaction \`${transaction.id}\` Scotial RTP CashIn initial failed.`, endInfo)

      }
    } catch(err) {
      LOGGER.error('_scotialRTPCashIn', `Transaction \`${transaction.id}\` Scotial RTP CashIn initial failed.`, err)
    }
    cashIn = await tx.cashIn.create({
      data: {
        status: CashInStatus.Cancel,
        method: CashInMethod.INTERAC,
        ownerId: Number(transaction.ownerId),
        transactionId: Number(transaction.id),
        endInfo: 'Scotia Payment initial fails',
        paymentAccountId: Number(transaction.sourceAccountId),
      }
    })
    return cashIn
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