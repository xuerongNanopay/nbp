//PUT Everything in one file now. I am lazy💀

import { base64Encode } from "@/utils/bast64Util.js"
import { AxiosError, type AxiosResponse } from "axios"
import type { 
  Credential, 
  OptionHeader, 
  RTPPaymentOptionsRequest, 
  RTPPaymentOptionsResult, 
  RTPPaymentRequest, 
  RTPPaymentResult, 
  RTPPaymentSummaryResult, 
  RawToken, 
  RequestForCancelPaymentRequest, 
  RequestForCancelResult, 
  RequestForPaymentDetailResult, 
  RequestForPaymentRequest, 
  RequestForPaymentResult, 
  RequestForPaymentStatusResult, 
  Token 
} from "./index.d.js"
import { CREDENTIAL, PRIVATE_KEY } from "./config.js"
import * as jose from 'jose'
import { getAxios } from "./config.js"
import { LOGGER } from "@/utils/logUtil.js"
import { Mutex } from "async-mutex"
import { APIError } from "@/schema/error.js"

//TODO: using single instance architecture for the module.

//Mutex when request a new token.
let TOKEN :Token
const mutex = new Mutex()

// Request is core service for the API.
// If it is outage for long time or cannot recover. We need to raise emergency alert.
async function _requestToken(): Promise<Token|null> {
  const credential = CREDENTIAL
  const endpoint = 'scotiabank/wam/v1/getToken'
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
        `httpCode: ${err.response?.status ?? "Empty httpCode"}`,
        `statusText: ${err.response?.statusText ?? "Empty statusText"}`,
        `response: ${!err.response?.data ? "Empty response" : JSON.stringify(err.response.data)}`,
        `request: ${!err.request ? "Empty Request": JSON.stringify(err.request)}`
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
    if ( !TOKEN || new Date().getTime() + 30000 > TOKEN.expires_in.getTime() ) {
      const release = await mutex.acquire()
      try {
        if (!TOKEN || new Date().getTime() + 30000 > TOKEN.expires_in.getTime() ) {
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
  const privateKey = PRIVATE_KEY
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
  const credential = CREDENTIAL
  return {
    'customer-profile-id': credential.CUSTOMER_PROFILE_ID,
    'x-country-code': credential.X_COUNTRY_CODE,
    'x-api-key': credential.API_KEY
  }
}

export async function rtpPaymentOptions(
  request: RTPPaymentOptionsRequest,
  optionHeaders: OptionHeader & Required<Pick<OptionHeader, 'x-b3-spanid' | 'x-b3-traceid'>>
): Promise<RTPPaymentOptionsResult> {
  const endPoint = 'treasury/payments/rtp/v1/payment-options/inquiry'
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
    ) as AxiosResponse<RTPPaymentOptionsResult>
    return response.data
  } catch (err) {
    if ( err instanceof AxiosError ) {
      LOGGER.error(
        'scotia_rtp', 
        'function: rtpPaymentOptions', 
        `httpCode: ${err.response?.status ?? "Empty httpCode"}`,
        `statusText: ${err.response?.statusText ?? "Empty statusText"}`,
        `response: ${!err.response?.data ? "Empty response" : JSON.stringify(err.response.data)}`,
        `request: ${!err.request ? "Empty Request": JSON.stringify(err.request)}`
      )
      if ( !!err.response ) throw new APIError({httpCode: err.response.status, response: err.response.data, request: err.request})
      throw new Error(err.message ?? err.name ?? err.code)
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

export async function rtpPayment(
  request: RTPPaymentRequest,
  optionHeaders: OptionHeader & Required<Pick<OptionHeader, 'x-b3-spanid' | 'x-b3-traceid'>>
): Promise<RTPPaymentResult> {
  const endPoint = 'treasury/payments/rtp/v1/payments/commit-transaction'
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
    ) as AxiosResponse<RTPPaymentResult>
    return response.data
  } catch (err) {
    if ( err instanceof AxiosError ) {
      LOGGER.error(
        'scotia_rtp', 
        'function: rtpPayment', 
        `httpCode: ${err.response?.status ?? "Empty httpCode"}`,
        `statusText: ${err.response?.statusText ?? "Empty statusText"}`,
        `response: ${!err.response?.data ? "Empty response" : JSON.stringify(err.response.data)}`,
        `request: ${!err.request ? "Empty Request": JSON.stringify(err.request)}`
      )
      if ( !!err.response ) throw new APIError({httpCode: err.response.status, response: err.response.data, request: err.request})
      throw new Error(err.message ?? err.name ?? err.code)
    } else {
      LOGGER.error(
        'scotia_rtp', 
        'function: rtpPayment', 
        JSON.stringify(err)
      )
      throw new Error("RTP Connection Fail")
    }
  }
}

export async function rtpPaymentSummary(
  paymentId: string,
  optionHeaders: OptionHeader & Required<Pick<OptionHeader, 'x-b3-spanid' | 'x-b3-traceid'>>
) : Promise<RTPPaymentSummaryResult>  {
  const endPoint = `treasury/payments/rtp/v1/payments/${paymentId}/summary`
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
    const response = await getAxios().get(
      endPoint,
      {
        headers
      }
    ) as AxiosResponse<RTPPaymentSummaryResult>
    return response.data
  } catch (err) {
    if ( err instanceof AxiosError ) {
      LOGGER.error(
        'scotia_rtp', 
        'function: rtpPaymentSummary', 
        `httpCode: ${err.response?.status ?? "Empty httpCode"}`,
        `statusText: ${err.response?.statusText ?? "Empty statusText"}`,
        `response: ${!err.response?.data ? "Empty response" : JSON.stringify(err.response.data)}`,
        `request: ${!err.request ? "Empty Request": JSON.stringify(err.request)}`
      )
      if ( !!err.response ) throw new APIError({httpCode: err.response.status, response: err.response.data, request: err.request})
      throw new Error(err.message ?? err.name ?? err.code)
    } else {
      LOGGER.error(
        'scotia_rtp', 
        'function: rtpPaymentSummary', 
        JSON.stringify(err)
      )
      throw new Error("RTP Connection Fail")
    }
  }
}

export async function requestForPayment(
  request: RequestForPaymentRequest,
  optionHeaders: OptionHeader & Required<Pick<OptionHeader, 'x-b3-spanid' | 'x-b3-traceid'>>
) : Promise<RequestForPaymentResult>  {
  const endPoint = 'treasury/payments/rtp/v1/requests'
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
    ) as AxiosResponse<RequestForPaymentResult>
    return response.data
  } catch (err) {
    if ( err instanceof AxiosError ) {
      LOGGER.error(
        'scotia_rtp', 
        'function: requestForPayment', 
        `httpCode: ${err.response?.status ?? "Empty httpCode"}`,
        `statusText: ${err.response?.statusText ?? "Empty statusText"}`,
        `response: ${!err.response?.data ? "Empty response" : JSON.stringify(err.response.data)}`,
        `request: ${!err.request ? "Empty Request": JSON.stringify(err.request)}`
      )
      if ( !!err.response ) throw new APIError({httpCode: err.response.status, response: err.response.data, request: err.request})
      throw new Error(err.message ?? err.name ?? err.code)
    } else {
      LOGGER.error(
        'scotia_rtp', 
        'function: requestForPayment', 
        JSON.stringify(err)
      )
      throw new Error("RTP Connection Fail")
    }
  }
}

export async function requestForPaymentStatus (
  paymentId: string,
  optionHeaders: OptionHeader & Required<Pick<OptionHeader, 'x-b3-spanid' | 'x-b3-traceid'>>
) : Promise<RequestForPaymentStatusResult>  {
  const endPoint = `treasury/payments/rtp/v1/requests?request_for_payment_id=${paymentId}`
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
    const response = await getAxios().get(
      endPoint,
      {
        headers
      }
    ) as AxiosResponse<RequestForPaymentStatusResult>
    return response.data
  } catch (err) {
    if ( err instanceof AxiosError ) {
      LOGGER.error(
        'scotia_rtp', 
        'function: requestForPaymentStatus', 
        `httpCode: ${err.response?.status ?? "Empty httpCode"}`,
        `statusText: ${err.response?.statusText ?? "Empty statusText"}`,
        `response: ${!err.response?.data ? "Empty response" : JSON.stringify(err.response.data)}`,
        `request: ${!err.request ? "Empty Request": JSON.stringify(err.request)}`
      )
      if ( !!err.response ) throw new APIError({httpCode: err.response.status, response: err.response.data, request: err.request})
      throw new Error(err.message ?? err.name ?? err.code)
    } else {
      LOGGER.error(
        'scotia_rtp', 
        'function: requestForPaymentStatus', 
        JSON.stringify(err)
      )
      throw new Error("RTP Connection Fail")
    }
  }
}

export async function requestForPaymentDetails(
  paymentId: string,
  optionHeaders: OptionHeader & Required<Pick<OptionHeader, 'x-b3-spanid' | 'x-b3-traceid'>>
) : Promise<RequestForPaymentDetailResult>  {
  const endPoint = `treasury/payments/rtp/v1/requests/${paymentId}`
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
    const response = await getAxios().get(
      endPoint,
      {
        headers
      }
    ) as AxiosResponse<RequestForPaymentDetailResult>
    return response.data
  } catch (err) {
    if ( err instanceof AxiosError ) {
      LOGGER.error(
        'scotia_rtp', 
        'function: requestForPaymentDetails', 
        `httpCode: ${err.response?.status ?? "Empty httpCode"}`,
        `statusText: ${err.response?.statusText ?? "Empty statusText"}`,
        `response: ${!err.response?.data ? "Empty response" : JSON.stringify(err.response.data)}`,
        `request: ${!err.request ? "Empty Request": JSON.stringify(err.request)}`
      )
      if ( !!err.response ) throw new APIError({httpCode: err.response.status, response: err.response.data, request: err.request})
      throw new Error(err.message ?? err.name ?? err.code)
    } else {
      LOGGER.error(
        'scotia_rtp', 
        'function: requestForPaymentDetails', 
        JSON.stringify(err)
      )
      throw new Error("RTP Connection Fail")
    }
  }
}

export async function cancelRequestForPayment(
  paymentId: string,
  request: RequestForCancelPaymentRequest,
  optionHeaders: OptionHeader & Required<Pick<OptionHeader, 'x-b3-spanid' | 'x-b3-traceid'>>
) : Promise<RequestForCancelResult> {
  const endPoint = `treasury/payments/rtp/v1/requests/${paymentId}/cancel`
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
    ) as AxiosResponse<RequestForCancelResult>
    return response.data
  } catch (err) {
    if ( err instanceof AxiosError ) {
      LOGGER.error(
        'scotia_rtp', 
        'function: cancelRequestForPayment', 
        `httpCode: ${err.response?.status ?? "Empty httpCode"}`,
        `statusText: ${err.response?.statusText ?? "Empty statusText"}`,
        `response: ${!err.response?.data ? "Empty response" : JSON.stringify(err.response.data)}`,
        `request: ${!err.request ? "Empty Request": JSON.stringify(err.request)}`
      )
      if ( !!err.response ) throw new APIError({httpCode: err.response.status, response: err.response.data, request: err.request})
      throw new Error(err.message ?? err.name ?? err.code)
    } else {
      LOGGER.error(
        'scotia_rtp', 
        'function: cancelRequestForPayment', 
        JSON.stringify(err)
      )
      throw new Error("RTP Connection Fail")
    }
  }
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

const RTPPaymentErrorMap = {
  ['E_PSVC_50100']: 'Mandatory field missing',
  ['E_PSVC_50101']: 'Invalid field length',
  ['E_PSVC_50102']: 'Invalid field value',
  ['E_PSVC_50103']: 'Invalid enumerate value',
  ['E_PSVC_50107']: 'Unknown field error',
  ['E_PSVC_50111']: 'Invalid field value. Instructed Amount must be greater than 0.',
  ['E_PSVC_50113']: 'Message Identification already exists. Please provide a unique value and try again.',
  ['E_PSVC_60100']: 'Insufficient funds in Debtor Account',
  ['E_PSVC_60101']: 'Invalid Debtor, check Debtor and re-try or contact the help desk.',
  ['E_PSVC_60200']: 'Invalid Creditor Account. Please check creditor account and try again.',
}