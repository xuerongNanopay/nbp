import { AxiosError, AxiosResponse } from "axios";
import { getAxios } from "./config.js";
import { LOGGER } from "@/utils/logUtil.js";


async function hello(): Promise<String> {
  const endPoint = '/treasury/payments/rtp/v1/payment-options/inquiry'
  const headers = {
    'Content-Type': 'application/json'
  }

  try {
    const response = await getAxios().get(
      endPoint,
      {
        headers
      }
    ) as AxiosResponse<string>
    return response.data
  } catch (err) {
    if ( err instanceof AxiosError ) {
      LOGGER.error(
        'nbp', 
        'function: hello', 
        `status: ${err.response?.status ?? "Empty status"}`,
        `statusText: ${err.response?.statusText ?? "Empty statusText"}`,
        `data: ${!err.response?.data ? "Empty data" : JSON.stringify(err.response.data)}`,
      )
      throw new Error(err.message)
    } else {
      LOGGER.error(
        'nbp', 
        'function: hello', 
        JSON.stringify(err)
      )
      throw new Error("NBP Connection Fail")
    }
  }
}