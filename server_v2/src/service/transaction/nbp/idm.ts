import { PRISMAService } from "@/service/prisma/index.js"
import {PrismaTransaction, TRANSACTION_PROJET_TYPE} from "./index.d.js"
import { TRANSACTION_PROJECT } from "./index.js"
import { TransactionStatus, TransferStatus } from "@prisma/client"
import { LOGGER } from "@/utils/logUtil.js"

export async function idmProcessor(transactionId: number): Promise<boolean> {
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