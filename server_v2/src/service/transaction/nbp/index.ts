import { PRISMAService } from "@/service/prisma/index.js"
import { LOGGER } from "@/utils/logUtil.js"
import { CashInMethod, CashInStatus, TransactionStatus } from "@prisma/client"

//Processing transactions
//Cancel transaction
//Refund transaction

// Initial CashIn.
// TODO: prevent sql injection.
export async function initialCashIn(transactionId: number) {

  const cashIn = await PRISMAService.$transaction(async (tx) => {
    const transactionResult = await PRISMAService.$queryRaw`
      select id, status, ownerId, sourceAccountId from transaction where id = ${transactionId} for update
    `
    const transaction = Array.isArray(transactionResult) ? transactionResult[0] : transactionResult
    if (!transaction) throw new Error(`Transaction \`${transactionId}\` no found`)
    if (transaction.status !== 'initial') throw new Error(`Transaction \`${transactionId}\` is not in initial status`)

    //TODO: call RTP API to initial payment.
    
    const cashInPromise = PRISMAService.cashIn.create({
      data: {
        status: CashInStatus.WAIT,
        method: CashInMethod.INTERAC,
        ownerId: Number(transaction.ownerId),
        transactionId: Number(transaction.id),
        paymentAccountId: Number(transaction.sourceAccountId),
        paymentLink: 'https//www.google.ca'
      }
    })
    const transactionPromise = PRISMAService.transaction.update({
      where: {
        id: transaction.id
      },
      data: {
        status: TransactionStatus.WAITING_FOR_PAYMENT
      }
    })
    const ret = await Promise.all([cashInPromise, transactionPromise])
    return ret[0]
  })
  return cashIn
}

// Once payment received processing the payment.
// IDM, NBP
async function processTransaction(transactionId: number) {
  //CashIn Finalize -> Initial IDM
  // IDM Finalize -> Initial NBP
  // NBP Finilize -> final transaction status.
  const a = await PRISMAService.$transaction(async (tx) => {
    //Just need to lock the transaction when we process it
    await PRISMAService.$queryRaw`select id from transaction where id = ${transactionId} for update`
    const transaction = await PRISMAService.transaction.findUnique({
      where: {
        id: transactionId
      },
      select: {
        id: true,
        status: true,
        cashIn: {
          select: {
            id: true,
            status: true,
            cashInReceiveAt: true
          }
        },
        transfers: {
          select: {
            id: true,
            status: true,
            next: {
              select: {
                id: true
              }
            }
          },
          orderBy: {
            id: 'asc'
          }
        }
      }
    })
    if (!transaction) throw new Error(`Transaction \`${transactionId}\` no found`)

    if ( 
      transaction.status == TransactionStatus.WAITING_FOR_PAYMENT && 
      !! transaction.cashIn && 
      (transaction.cashIn.status === CashInStatus.COMPLETE ||
        transaction.cashIn.status === CashInStatus.FAIL)
    ) {
      if (transaction.cashIn.status === CashInStatus.FAIL) {
        await PRISMAService.transaction.update({
          where: {
            id: transaction.id
          },
          data: {
            status: TransactionStatus.REJECT,
            failedAt: new Date(),
            endInfo: 'Do not receive the payment'
          }
        })
        LOGGER.warn('Transaction Process', `Transation \`${transactionId}\` do not receive the payment`)
      } else if (transaction.cashIn.status === CashInStatus.COMPLETE) {
        // CashIn received, Initial IDM.
      } else {
        LOGGER.error('Transaction Process', `Transation \`${transactionId}\``, 'Unable to process')
        throw new Error(`Unable to process transaction \`${transaction.id}\``)
      }
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

}