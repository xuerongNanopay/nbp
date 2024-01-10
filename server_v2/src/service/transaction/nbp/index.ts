import { PRISMAService } from "@/service/prisma/index.js"
import { TransactionStatus } from "@prisma/client"

//Processing transactions
//Cancel transaction
//Refund transaction

// Initial CashIn.
export async function initialCashIn(transactionId: number) {

  // PRISMAService.$transaction(async (tx) => {
    
  // })
  const transaction = await PRISMAService.transaction.findUnique({
    where: {
      id: transactionId
    },
    select: {
      id: true,
      status: true,
      cashIn: {
        select: {
          status: true
        }
      }
    }
  })
  if (!transaction) throw new Error(`Transaction no found with id: \`${transactionId}\``)
  if (transaction.status !== TransactionStatus.INITIAL) throw new Error(`Can not Initial transaction with id: \`${transactionId}\``)
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