import * as jose from 'jose'
import { LOGGER } from "@/utils/logUtil.js";
import { PEER_PUBLIC_KEY, PRIVATE_KEY } from '@/partner/scotia_rtp/config.js';
import type { RTPHookRequest } from '@/partner/scotia_rtp/index.d.js';

//TODO: get data from parameter.
export async function scotiaRTPHookHandler(rawData: string) {
  LOGGER.info('Hook: scotiaRTPHookHandler')
  const data = JSON.parse(rawData)
  //TODO: check if it is general or compact format.
  const encData = data['encData']

  //Using Our private to decrypt
  //Using our public to decript.
  const { plaintext } = await jose.generalDecrypt(encData, PRIVATE_KEY)

  const { payload } = await jose.compactVerify(plaintext, PEER_PUBLIC_KEY)
  
  const requestPayload = new TextDecoder().decode(payload)

  const request: RTPHookRequest = JSON.parse(requestPayload)


}