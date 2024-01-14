import { finalizeIDMTransfer } from "@/service/transaction/nbp/idm.js"
import { LOGGER } from "@/utils/logUtil.js"

export async function idmHookHandler(tid: string, decision: string) {
  if ( decision !== 'ACCEPTED' && decision !== 'REJECTED') {
    LOGGER.error('hook: idmHookHandler', `tid: \`${tid}\` received unsupported decision: \`${decision}\``)
    throw new Error('Unsupport decision')
  }

  await finalizeIDMTransfer(tid, decision)
}