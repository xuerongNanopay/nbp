import { PRISMAService } from "@/service/prisma/index.js";
import { TransactionStatus, TransferStatus } from "@prisma/client";
import { updateIDMTransfer } from "../nbp/idm.js";

type Props = {
  transactionId: number,
  newStatus: 'ACCEPTED' | 'REJECTED' | 'ACCEPT' | 'DENY'
}
export async function refreshIDMTransferStatus({transactionId, newStatus}: Props) {
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
    transaction.transfers.length !== 1 ||
    transaction.transfers[0]!.status !== TransferStatus.WAIT) {
      throw new Error(`Transaction \`${transactionId}\` do not have proper IDM Transfer`)
    }

  return await updateIDMTransfer(transaction.id, transaction.transfers[0]!.id, newStatus)
}