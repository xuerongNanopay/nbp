import { PRISMAService } from "@/service/prisma/index.js"
import { CashInMethod, CashInStatus } from "@prisma/client"

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
    console.log(transaction, transaction.id)
    //TODO: call RTP API to initial payment.

    const cashIn = await PRISMAService.cashIn.create({
      data: {
        status: CashInStatus.WAIT,
        method: CashInMethod.INTERAC,
        ownerId: Number(transaction.ownerId),
        transactionId: Number(transaction.id),
        paymentAccountId: Number(transaction.sourceAccountId),
        paymentLink: 'https//www.google.ca'
      }
    })
    return cashIn
  })
  return cashIn
}

// Once payment received processing the payment.
async function processTransaction(transactionId: number) {

}

//Retry only available on the last transfer.
//And transfer status is FAIL.
async function retryTransaction(transactionId: number) {

}

async function cancelTransaction(transactionId: number) {

}

async function refundTransaction(transactionId: number) {

}