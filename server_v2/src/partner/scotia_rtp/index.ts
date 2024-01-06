//PUT Everything in one file now. I am lazy💀

import { base64Encode } from "@/utils/bast64Util.js"
import { AxiosError, type AxiosResponse } from "axios"
import type { 
  Credential, 
  OptionHeader, 
  PaymentOptionsRequest, 
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
  optionHeaders: OptionHeader = {}
) {
  const endpoint = '/treasury/payments/rtp/v1/payment-options/inquiry'
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
      endpoint,
      request,
      {
        headers
      }
    )
  } catch (err) {

  }
}

function rtpPayment() {

}

function rtpPaymentSummary() {

}

function requestForPayment() {

}

function requestForPaymentDetails() {

}

function cancelRequestForPayment() {

}