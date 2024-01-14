import { PRISMAService } from "@/service/prisma/index.js"
import { LOGGER } from "@/utils/logUtil.js"
import { 
  CashIn, 
  CashInStatus, 
  Prisma, 
  TransactionStatus, 
  TransferStatus 
} from "@prisma/client"
import { nbpProcessor } from "./nbp.js"
import { idmProcessor } from "./idm.js"
import { cashInProcessor, scotialRTPCashIn } from "./cash_in.js"
import { TRANSACTION_PROJET_TYPE } from "./index.d.js"

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
      externalRef: true,
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
  const transaction: TRANSACTION_PROJET_TYPE | null = await PRISMAService.transaction.findUnique({
    where: {
      id: transactionId
    },
    select: TRANSACTION_PROJECT
  })
  if (!transaction) throw new Error(`Transaction \`${transactionId}\` no found`)

  if ( 
    transaction.status === TransactionStatus.WAITING_FOR_PAYMENT
  ) {
    return await cashInProcessor(transactionId)
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

function _isTransactionTeminate(status: TransactionStatus) {
  return status === TransactionStatus.CANCEL || status === TransactionStatus.REFUND
}

function _isTransactionRefund(status: TransactionStatus) {
  return status === TransactionStatus.REFUND_IN_PROGRESS || status === TransactionStatus.REFUND
}

function _isCashInFinish(status: CashInStatus) {
  return status === CashInStatus.COMPLETE || status === CashInStatus.Cancel || status === CashInStatus.FAIL
}