import { PRISMAService } from "@/service/prisma/index.js";
import { TransactionStatus, TransferStatus } from "@prisma/client";
import { finalizeNBPTransfer } from "../nbp/nbp.js";

export async function refreshNBPTransferStatus(transactionId: number) {
  const transaction = await PRISMAService.transaction.findUnique({
    where: {
      id: transactionId,
    },
    select: {
      id: true,
      status: true,
      cashIn: {
        select: {
          status: true,
          externalRef: true
        }
      },
      transfers: {
        orderBy: {
          id: 'asc'
        },
        select: {
          id: true,
          name: true,
          status: true,
          externalRef: true
        }
      }
    }
  })
  if (!transaction) throw new Error(`Transaction no found with id == \`${transactionId}\``)
  if (transaction.status !== TransactionStatus.PROCESS) throw new Error(`Expect Transaction status to be \`${TransactionStatus.PROCESS}\`, but \`${transaction.status}\``)
  if (!transaction.transfers || 
    transaction.transfers.length !== 2 ||
    transaction.transfers[1]!.status !== TransferStatus.WAIT) {
      throw new Error(`Transaction \`${transactionId}\` do not have proper NBP Transfer`)
    }

  return await finalizeNBPTransfer(transaction.id, transaction.transfers[1]!.id)
}