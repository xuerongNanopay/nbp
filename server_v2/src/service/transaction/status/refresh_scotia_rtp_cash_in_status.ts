import { PRISMAService } from "@/service/prisma/index.js";

export async function refreshScotiaRTPCashInStatus(transactionId: number) {
  const transaction = await PRISMAService.transaction.findUnique({
    where: {
      id: transactionId
    },
    select: {
      id: true,
    }
  })
  if (!transaction) throw new Error(`Transaction no found with id == \`${transactionId}\``)

  await PRISMAService.$transaction(async (tx) => {
    const transaction = await PRISMAService.transaction.findUnique({
      where: {
        id: transactionId
      },
      select: {
        id: true,
        status: true,
        cashIn: {
          id: true,
          stat
        }
      }
    })
  })
}