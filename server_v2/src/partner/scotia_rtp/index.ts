//PUT Everything in one file now. I am lazy💀

import { base64Encode } from "@/utils/bast64Util.js"
import { AxiosError, type AxiosResponse } from "axios"
import type { 
  Credential, 
  OptionHeader, 
  PaymentOptionsRequest, 
  PaymentOptionsResult, 
  RawToken, 
  Token 
} from "./index.d.js"
import { getCredential, getPrivateKey } from "./config.js"
import * as jose from 'jose'
import { getAxios } from "./axios.js"
import { LOGGER } from "@/utils/logUtil.js"
import { Mutex } from "async-mutex"

//TODO: using single instance architecture for the module.

//Mutex when request a new token.
let TOKEN :Token
const mutex = new Mutex()

// Request is core service for the API.
// If it is outage for long time or cannot recover. We need to raise emergency alert.
async function _requestToken(): Promise<Token|null> {
  const credential = getCredential()
  const endpoint = '/scotiabank/wam/v1/getToken'
  const basicAuth = base64Encode(`${credential.API_KEY}:${credential.API_SECRET}`)
  const formData = new FormData()
  formData.append("grant_type", encodeURIComponent("client_credentials"))
  formData.append("scope", encodeURIComponent(credential.SCOPE))
  formData.append("client_id", encodeURIComponent(credential.CLIENT_ID))
  formData.append("client_assertion", encodeURIComponent(await _signJWT(credential)))
  formData.append("client_assertion_type", encodeURIComponent(credential.CLIENT_ASSERTION_TYPE))

  try {
    const axiosResponse = await getAxios().post(
      endpoint,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${basicAuth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )
  
    const response = axiosResponse as AxiosResponse<RawToken, any>
    const rawToken = response.data
    LOGGER.info('scotia_rtp', 'token update', `expires_in: ${new Date(rawToken.expires_in)}`)
    return {
      ...rawToken,
      expires_in: new Date(rawToken.expires_in)
    }
  } catch (err) {
    if ( err instanceof AxiosError ) {
      LOGGER.error(
        'scotia_rtp', 
        'function: _requestToken', 
        `status: ${err.response?.status ?? "Empty status"}`,
        `statusText: ${err.response?.statusText ?? "Empty statusText"}`,
        `data: ${!err.response?.data ? "Empty data" : JSON.stringify(err.response.data)}`,
      )
    } else {
      LOGGER.error(
        'scotia_rtp', 
        'function: _requestToken', 
        JSON.stringify(err)
      )
    }
  }
  return null
}

async function _getToken(): Promise<Token | null> {
  const maxRetryAttempts = 3
  for (let i=0 ; i < maxRetryAttempts ; i++ ) {
    if ( !TOKEN || new Date().getTime() > TOKEN.expires_in.getTime() ) {
      const release = await mutex.acquire()
      try {
        if (!TOKEN || new Date().getTime() > TOKEN.expires_in.getTime() ) {
          const newToken = await _requestToken()
          if (!newToken) continue
          TOKEN = newToken
        }
      } catch (err) {
        LOGGER.error('scotia_rtp', 'function: _getToken', err)
      } finally {
        release()
      }
    }
    return TOKEN
  }
  return null
}

async function _signJWT(credential: Credential): Promise<string> {
  const privateKey = getPrivateKey()
  const jwt = await new jose.SignJWT()
              .setProtectedHeader({
                alg: 'RS256',
                typ: 'JWT',
                kid: credential.JWT_KID
              })
              .setSubject(credential.CLIENT_ID)
              .setIssuer(credential.CLIENT_ID)
              .setAudience(credential.JWT_AUDIENCE)
              .setExpirationTime(credential.JWT_EXPIRY)
              .sign(privateKey)
  return jwt
}

function _getDefaultHeaders(): Record<string, string> {
  const credential = getCredential()
  return {
    'customer-profile-id': credential.CUSTOMER_PROFILE_ID,
    'x-country-code': credential.X_COUNTRY_CODE,
    'x-api-key': credential.API_KEY
  }
}

async function rtpPaymentOptions(
  request: PaymentOptionsRequest,
  optionHeaders: OptionHeader & Required<Pick<OptionHeader, 'x-b3-spanid' | 'x-b3-traceid'>>
): Promise<PaymentOptionsResult> {
  const endPoint = '/treasury/payments/rtp/v1/payment-options/inquiry'
  let headers = _getDefaultHeaders()
  const token = await _getToken()

  if (!token) throw new Error('Fail to fetch acotia_rtp access token.')
  headers = {
    ...headers,
    'Authorization': `Bearer ${token.access_token}`,
    'Content-Type': 'application/json',
    ...optionHeaders
  }

  try {
    const response = await getAxios().post(
      endPoint,
      request,
      {
        headers
      }
    ) as AxiosResponse<PaymentOptionsResult>
    return response.data
  } catch (err) {
    if ( err instanceof AxiosError ) {
      LOGGER.error(
        'scotia_rtp', 
        'function: rtpPaymentOptions', 
        `status: ${err.response?.status ?? "Empty status"}`,
        `statusText: ${err.response?.statusText ?? "Empty statusText"}`,
        `data: ${!err.response?.data ? "Empty data" : JSON.stringify(err.response.data)}`,
      )
      throw new Error(err.message)
    } else {
      LOGGER.error(
        'scotia_rtp', 
        'function: rtpPaymentOptions', 
        JSON.stringify(err)
      )
      throw new Error("RTP Connection Fail")
    }
  }
}

async function rtpPayment(
  request: PaymentOptionsRequest,
  optionHeaders: OptionHeader & Required<Pick<OptionHeader, 'x-b3-spanid' | 'x-b3-traceid'>>
): Promise<null> {
  const endPoint = '/treasury/payments/rtp/v1/payments/commit-transaction'
  let headers = _getDefaultHeaders()
  const token = await _getToken()
  if (!token) throw new Error('Fail to fetch acotia_rtp access token.')
  headers = {
    ...headers,
    'Authorization': `Bearer ${token.access_token}`,
    'Content-Type': 'application/json',
    ...optionHeaders
  }

  try {
    const response = await getAxios().post(
      endPoint,
      request,
      {
        headers
      }
    ) as AxiosResponse<PaymentOptionsResult>
    return response.data
  } catch (err) {
    if ( err instanceof AxiosError ) {
      LOGGER.error(
        'scotia_rtp', 
        'function: rtpPaymentOptions', 
        `status: ${err.response?.status ?? "Empty status"}`,
        `statusText: ${err.response?.statusText ?? "Empty statusText"}`,
        `data: ${!err.response?.data ? "Empty data" : JSON.stringify(err.response.data)}`,
      )
      throw new Error(err.message)
    } else {
      LOGGER.error(
        'scotia_rtp', 
        'function: rtpPaymentOptions', 
        JSON.stringify(err)
      )
      throw new Error("RTP Connection Fail")
    }
  }
}

function rtpPaymentSummary() {

}

function requestForPayment() {

}

function requestForPaymentDetails() {

}

function cancelRequestForPayment() {

}

const RTPPaymentOptionsErrorMap = {
  ['E_PSVC_50100']: 'Mandatory field missing',
  ['E_PSVC_50101']: 'Invalid field length',
  ['E_PSVC_50102']: 'Invalid field value',
  ['E_PSVC_50103']: 'Invalid enumerate value',
  ['E_PSVC_50104']: 'Provided Deposit Type not supported',
  ['E_PSVC_50107']: 'Unknown field error',
  ['E_PSVC_50109']: 'Creditor Agent not enabled for Account Deposit',
  ['E_PSVC_60200']: 'Invalid Creditor Account. Please check creditor account and try again.',
  ['E_PSVC_60000']: 'Unable to process the request due to a system problem. Please contact the help desk.',
}