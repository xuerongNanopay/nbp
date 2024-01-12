import { LOGGER } from "@/utils/logUtil.js";

//TODO: get data from parameter.
export async function scotiaRTPHookHandler(rawData: string) {
  LOGGER.info('Hook: scotiaRTPHookHandler')
  const data = JSON.parse(rawData)
  const encData = data['encData']

  //Using Our private to decrypt
  //Using our public to decript.
}