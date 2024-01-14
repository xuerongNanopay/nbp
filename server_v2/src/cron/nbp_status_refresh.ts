import { NBPService } from '@/service/nbp/index.js'
import { PRISMAService } from '@/service/prisma/index.js'
import { finalizeNBPTransfers } from '@/service/transaction/nbp/nbp.js'
import { LOGGER } from '@/utils/logUtil.js'
import { TransferStatus } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'

export async function nbpStatusRefresh() {
  const cronIdentifier = uuidv4()
  LOGGER.info('cron: nbpStatusRefresh initial', `cronID: \`${cronIdentifier}\``)

  const nbpTransfers = await PRISMAService.transfer.findMany({
    where: {
      status: TransferStatus.WAIT,
      name: 'NBP'
    },
    select: {
      id: true,
      status: true,
      externalRef: true
    }
  })

  if (!nbpTransfers || nbpTransfers.length === 0) {
    LOGGER.info('cron: nbpStatusRefresh end', `cronID: \`${cronIdentifier}\``)
  }

  const globalIds = nbpTransfers.map(t => t.externalRef!)
  const statusesResult = await NBPService.transactionStatusByIds(...globalIds)
  const newStatuses = statusesResult.transactionStatuses
  const ns = newStatuses.map((s) => {
    const transfer = nbpTransfers.find(t => t.externalRef === s.Global_Id)!
    return {...s, transferId: transfer.id}
  })
  await finalizeNBPTransfers(ns)
  LOGGER.info('cron: nbpStatusRefresh end', `cronID: \`${cronIdentifier}\``)
}