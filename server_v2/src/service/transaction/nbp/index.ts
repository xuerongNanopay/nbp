import { PRISMAService } from "@/service/prisma/index.js"
import { LOGGER } from "@/utils/logUtil.js"
import { CashIn, CashInMethod, CashInStatus, Prisma, TransactionStatus, TransferStatus } from "@prisma/client"

//Processing transactions
//Cancel transaction
//Refund transaction

// Initial CashIn.
// TODO: prevent sql injection.
export async function initialCashIn(transactionId: number): Promise<CashIn> {

  const cashIn = await PRISMAService.$transaction(async (tx) => {
    const transactionResult = await PRISMAService.$queryRaw`
      select id, status, ownerId, sourceAccountId from transaction where id = ${transactionId} for update
    `
    const transaction = Array.isArray(transactionResult) ? transactionResult[0] : transactionResult
    if (!transaction) throw new Error(`Transaction \`${transactionId}\` no found`)
    if (transaction.status !== 'initial') throw new Error(`Transaction \`${transactionId}\` is not in initial status`)

    //TODO: call RTP API to initial payment.
    //IF, RTP fail reject transaction.
    
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
// Previous status should initial next one.
export async function processTransaction(transactionId: number) {
  //CashIn Finalize -> Initial IDM
  // IDM Finalize -> Initial NBP
  // NBP Finilize -> final transaction status.
  const a = await PRISMAService.$transaction(async (tx) => {
    //Just need to lock the transaction when we process it
    await tx.$queryRaw`select id from transaction where id = ${transactionId} for update`
    const transaction = await tx.transaction.findUnique({
      where: {
        id: transactionId
      },
      select: TRANSACTION_PROJECT
    })
    if (!transaction) throw new Error(`Transaction \`${transactionId}\` no found`)

    if ( 
      transaction.status == TransactionStatus.WAITING_FOR_PAYMENT && 
      !! transaction.cashIn && 
      (transaction.cashIn.status === CashInStatus.COMPLETE ||
        transaction.cashIn.status === CashInStatus.FAIL)
    ) {
      if (transaction.cashIn.status === CashInStatus.FAIL) {
        await tx.transaction.update({
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
        //TODO: CashIn received, Initial IDM.
      
        await tx.transaction.update({
          where: {
            id: transaction.id
          },
          data: {
            status: TransactionStatus.PROCESS,
            transfers: {
              create: [
                {
                  name: 'IDM',
                  status: TransferStatus.INITIAL,
                  ownerId: transaction.ownerId,
                }
              ]
            }
          }
        })
        //TODO: call IDM


      } else {
        LOGGER.error('Transaction Process', `Transation \`${transactionId}\``, 'Unable to process')
        throw new Error(`Unable to process transaction \`${transaction.id}\``)
      }
    }
  })
}

//Who do this: Avoid transaction reprocessing.
async function _tryProcessing(transactionId: number) {
  const transaction = await PRISMAService.transaction.findUnique({
    where: {
      id: transactionId
    },
    select: TRANSACTION_PROJECT
  })
  if (!transaction) throw new Error(`Transaction \`${transactionId}\` no found`)

  if ( 
    transaction.status == TransactionStatus.WAITING_FOR_PAYMENT
  ) {
    return  await _cashInProcessor(transactionId)
  } else if (
    transaction.status == TransactionStatus.PROCESS &&
    !!transaction.transfers && transaction.transfers.length === 1
  ) {
    return await _idmProcessor(transactionId)
  } else if (
    transaction.status == TransactionStatus.PROCESS &&
    !!transaction.transfers && transaction.transfers.length === 2
  ) {
    // return await _nbpProcessor(transactionId)
  } else {
    LOGGER.warn(
      'Transaction Processor', 
      `Transation \`${transactionId}\``, 
      `Cash In complete, Transaction status update to \`${TransactionStatus.PROCESS}\``
    )
    return false
  }
}

async function _cashInProcessor(transactionId: number): Promise<boolean> {
  return await PRISMAService.$transaction(async (tx) => {
    await tx.$queryRaw`select id from transaction where id = ${transactionId} for update`
    const transaction = await tx.transaction.findUniqueOrThrow({
      where: {
        id: transactionId
      },
      select: TRANSACTION_PROJECT
    })    
    if (transaction.status == TransactionStatus.WAITING_FOR_PAYMENT) return false
    if (!transaction.cashIn) throw Error(`Transaction \`${transactionId}\` miss cash_in during Cash In Process`)

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
    } else if (transaction.cashIn.status === CashInStatus.FAIL) {
      await tx.transaction.update({
        where: {
          id: transaction.id
        },
        data: {
          status: TransactionStatus.REJECT,
          failedAt: new Date(),
          endInfo: 'Do not receive the payment'
        }
      })
      LOGGER.warn('Transaction CashIn Processor', `Transation \`${transactionId}\` Cash In failed.`)
      return true
    } else {
      LOGGER.warn('Transaction CashIn Processor', `Transaction: \`${transactionId}\``, `No status change`, `CashIn Status: \`${transaction.cashIn.status}\``)
      return false
    }
  })
}

async function _idmProcessor(transactionId: number): Promise<boolean> {
  return await PRISMAService.$transaction(async (tx) => {
    await tx.$queryRaw`select id from transaction where id = ${transactionId} for update`
    const transaction = await tx.transaction.findUnique({
      where: {
        id: transactionId
      },
      select: TRANSACTION_PROJECT
    })
    if (!transaction) throw new Error(`Transaction \`${transactionId}\` no found`)
    return false
  })
}
function _isTransferInComplete(status: TransferStatus) {
  return status === TransferStatus.CANCEL || status === TransferStatus.COMPLETE || status === TransferStatus.FAIL
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

const TRANSACTION_PROJECT = {
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
    orderBy: {
      id: Prisma.SortOrder.asc
    },
    select: {
      id: true,
      name: true,
      status: true,
      next: {
        select: {
          id: true
        }
      }
    }
  },
  ownerId: true
}