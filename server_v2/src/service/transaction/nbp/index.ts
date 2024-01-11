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
      select id, status, ownerId, sourceCurrency from transaction where id = ${transactionId} for update
    `
    const transaction = Array.isArray(transactionResult) ? transactionResult[0] : transactionResult
    if (!transaction) throw new Error(`Transaction \`${transactionId}\` no found`)
    if (transaction.status !== 'initial') throw new Error(`Transaction \`${transactionId}\` is not in initial status`)

    //TODO: call RTP API to initial payment.

    const cashIn = await PRISMAService.cashIn.create({
      data: {
        status: CashInStatus.WAIT,
        method: CashInMethod.INTERAC,
        ownerId: transaction.ownerId,
        transactionId: transaction.id,
        paymentAccountId: transaction.sourceCurrency,
        paymentLink: 'https//www.google.ca'
      }
    })
    return cashIn
  })
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