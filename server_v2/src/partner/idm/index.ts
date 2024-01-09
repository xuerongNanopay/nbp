import { base64Encode } from "@/utils/bast64Util.js";
import { TransferReqeust, TransferResult } from "./index.d.js";
import { CREDENTIAL, getAxios } from "./config.js";
import { AxiosError, AxiosResponse } from "axios";
import { LOGGER } from "@/utils/logUtil.js";

export async function transferout(
  request: TransferReqeust
) : Promise<TransferResult> {
  const endPoint = 'account/transferout'
  const credential = CREDENTIAL
  const basicAuth = base64Encode(`${credential.API_USER}:${credential.API_KEY}`)
  const headers = {
    'Content-Type': 'application/json',
    'Accept-Encoding': 'UTF-8',
    'Authorization': `Bearer ${basicAuth}`,
  }

  try {
    const axiosResponse = await getAxios().post(
      endPoint,
      request,
      {
        headers
      }
    ) as AxiosResponse<TransferResult, any>
    return axiosResponse.data
  } catch(err) {
    if ( err instanceof AxiosError ) {
      LOGGER.error(
        'IDM', 
        'function: transferout',
        `httpCode: ${err.code ?? 'Empty httpCode'}`,
        `response: ${!err.response?.data ? "Empty data" : JSON.stringify(err.response.data)}`,
      )
      throw new Error(err.message ?? `IDM \`transferout\` fails with code \`${err.code}\``)
    } else {
      LOGGER.error(
        'IDM', 
        'function: transferout', 
        JSON.stringify(err)
      )
      throw new Error("IDM Connection Fail")
    }
  }
}