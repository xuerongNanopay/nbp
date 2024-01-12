import { PRISMAService } from "@/service/prisma/index.js"
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
        cashInReceiveAt: true
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

    try {
      //TODO: call RTP API to initial payment.
      //Send Email to user.
      //IF, RTP fail reject transaction.
      const cashInPromise = tx.cashIn.create({
        data: {
          status: CashInStatus.WAIT,
          method: CashInMethod.INTERAC,
          ownerId: Number(transaction.ownerId),
          transactionId: Number(transaction.id),
          paymentAccountId: Number(transaction.sourceAccountId),
          paymentLink: 'https//www.google.ca'
        }
      })
      const transactionPromise = tx.transaction.update({
        where: {
          id: transaction.id
        },
        data: {
          status: TransactionStatus.WAITING_FOR_PAYMENT
        }
      })
      const ret = await Promise.all([cashInPromise, transactionPromise])
      return ret[0]
    } catch(err: any) {
      //TODO: If fails What I should do?.
      //put a cash in with fail status?
      LOGGER.error('CashIn Initial', `transaction \`${transactionId}\``, err)
      throw Error("Transaction Initial failed.")
    }    
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
    } else if (transaction.cashIn.status === CashInStatus.FAIL) {
      await tx.transaction.update({
        where: {
          id: transaction.id
        },
        data: {
          status: TransactionStatus.REJECT,
          terminatedAt: new Date(),
          endInfo: 'Do not receive the payment'
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

function _isTransactionTeminate(status: TransactionStatus) {
  return status === TransactionStatus.CANCEL || status === TransactionStatus.REFUND
}

function _isTransactionRefund(status: TransactionStatus) {
  return status === TransactionStatus.REFUND_IN_PROGRESS || status === TransactionStatus.REFUND
}