import * as jose from 'jose'
import { LOGGER } from "@/utils/logUtil.js";
import { PEER_PUBLIC_KEY, PRIVATE_KEY } from '@/partner/scotia_rtp/config.js';
import type { RTPHookRequest } from '@/partner/scotia_rtp/index.d.js';
import { PRISMAService } from '@/service/prisma/index.js';
import { CashInStatus } from '@prisma/client';

//TODO: get data from parameter.
export async function scotiaRTPHookHandler(rawData: string) {
  const data = JSON.parse(rawData)
  //TODO: check if it is general or compact format.
  const encData = data['encData']
  //Using Our private to decrypt
  //Using our public to decript.
  const { plaintext } = await jose.generalDecrypt(encData, PRIVATE_KEY)
  const { payload } = await jose.compactVerify(plaintext, PEER_PUBLIC_KEY)
  const requestPayload = new TextDecoder().decode(payload)
  const request: RTPHookRequest = JSON.parse(requestPayload)

  LOGGER.info('Hook: scotiaRTPHookHandler', `payment_id: \`${request.payment_id}\``, `request: \`${requestPayload}\``)

  const cashIn = await PRISMAService.cashIn.findFirst({
    where: {
      externalRef: request.payment_id
    },
    select: {
      id: true,
      status: true
    }
  })
  if (!cashIn) {
    LOGGER.error('Hook: scotiaRTPHookHandler', `Cash In no found with externalRef == \`${request.payment_id}\``)
    throw new Error(`No associated record with payment_id: \`${request.payment_id}\``)
  }
  if (cashIn.status !== CashInStatus.WAIT) {
    LOGGER.warn('Hook: scotiaRTPHookHandler', `Cash In \`${cashIn.id}\` is not in \`${CashInStatus.WAIT}\` but \`${cashIn.status}\``)
    throw new Error(`Unable to process payment_id: \`${request.payment_id}\``)
  }

  
}