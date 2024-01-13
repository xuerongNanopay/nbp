import { v4 as uuidv4 } from 'uuid'
import { PRISMAService } from "@/service/prisma/index.js"
import { finalizeCashInStatusFromRTPPaymentId } from "@/service/transaction/nbp/index.js"
import { LOGGER } from "@/utils/logUtil.js"
import { CashInMethod, CashInStatus } from "@prisma/client"

export async function scotiaRTPCIStatusRefresher() {
  const cronIdentifier = uuidv4()
  LOGGER.info('cron: scotiaRTPCIStatusRefresher initial', `cronID: \`${cronIdentifier}\``)
  const cashIns = await PRISMAService.cashIn.findMany({
    where: {
      status: CashInStatus.WAIT,
      method: CashInMethod.INTERAC
    },
    select: {
      id: true,
      status: true,
      externalRef: true,
      transactionId: true,
    }
  })
  LOGGER.info('cron: scotiaRTPCIStatusRefresher', `cronID: \`${cronIdentifier}\``, `Total \`${!cashIns ? 0 : cashIns.length}\` transactions is being processed`)
  for (let cashin of cashIns) {
    try {
      await finalizeCashInStatusFromRTPPaymentId(cashin.externalRef!)
    } catch(err: any) {
      LOGGER.error('cron: scotiaRTPCIStatusRefresher', `cronID: \`${cronIdentifier}\``, err.message)
    }
  }
  LOGGER.info('cron: scotiaRTPCIStatusRefresher end', `cronID: \`${cronIdentifier}\``)
}