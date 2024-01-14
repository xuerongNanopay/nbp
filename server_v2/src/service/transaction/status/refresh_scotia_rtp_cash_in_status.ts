import { PRISMAService } from "@/service/prisma/index.js";
import { CashInStatus, TransactionStatus } from "@prisma/client";
import { finalizeCashInStatusFromRTPPaymentId } from "../nbp/cash_in.js";

export async function refreshScotiaRTPCashInStatus(transactionId: number) {
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
      }
    }
  })
  if (!transaction) throw new Error(`Transaction no found with id == \`${transactionId}\``)
  if (transaction.status !== TransactionStatus.WAITING_FOR_PAYMENT) throw new Error(`Expect Transaction status to be \`${TransactionStatus.WAITING_FOR_PAYMENT}\`, but \`${transaction.status}\``)
  if (!transaction.cashIn) throw new Error(`Transaction \`${transactionId}\` does not initiate CashIn`)
  if (transaction.cashIn.status !== CashInStatus.WAIT) throw new Error(`Expect CashIn status to be \`${CashInStatus.WAIT}\`, but \`${transaction.cashIn.status}\``)

  return await finalizeCashInStatusFromRTPPaymentId(transaction.cashIn.externalRef!)
}