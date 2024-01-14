import { LOGGER } from "@/utils/logUtil.js"
import { CashInMethod, CashInStatus, TransactionStatus, TransferStatus } from "@prisma/client"
import type {PrismaTransaction, TRANSACTION_PROJET_TYPE} from "./index.d.js"
import { ScotiaRTPService } from "@/service/scotia_rtp/index.js"
import { PRISMAService } from "@/service/prisma/index.js"
import { TRANSACTION_PROJECT, processTransaction } from "./index.js"

// Finilizing CashIn and initial IDM.
export async function cashInProcessor(transactionId: number): Promise<boolean> {
  return await PRISMAService.$transaction(async (tx) => {
    await tx.$queryRaw`select id from transaction where id = ${transactionId} for update`
    const transaction: TRANSACTION_PROJET_TYPE = await tx.transaction.findUniqueOrThrow({
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
      return false
    } else {
      LOGGER.warn('Transaction CashIn Processor', `No status change`, `Transaction: \`${transactionId}\` has CashIn Status: \`${transaction.cashIn.status}\``)
      return false
    }
  })
}

//This function should not throw any Error.
export async function scotialRTPCashIn(
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
        amount: transaction.debitAmount/100.0,
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
          await tx.transaction.update({
            where: {
              id: transactionId
            },
            data: {
              status: TransactionStatus.WAITING_FOR_PAYMENT
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
    await tx.transaction.update({
      where: {
        id: transactionId
      },
      data: {
        status: TransactionStatus.WAITING_FOR_PAYMENT
      }
    })
    return cashIn
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
    return cashIn
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
    return cashIn
  }

  const newCashIn = await PRISMAService.$transaction(async (tx) => {
    await tx.$queryRaw`select id from transaction where id = ${cashIn.transactionId} for update`
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
      const newCashIn =  await tx.cashIn.update({
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
      const newCashIn =  await tx.cashIn.update({
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
      LOGGER.error('func: updateCashInStatusFromRTPPaymentId', `CashIn \`${cashIn.id}\` reached Unexpected state.`)
      throw new Error(`Unable to process CashIn \`${cashIn.id}\``)
    }
  })
  if (_isCashInFinish(newCashIn.status)) await processTransaction(newCashIn.transactionId)
  return newCashIn
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