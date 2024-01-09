import axios, { AxiosError, AxiosResponse } from "axios"
import { CREDENTIAL, getAxios } from "./config.js"
import { LOGGER } from "@/utils/logUtil.js"

import type {
  AccountEnquiryRequest,
  AccountEnquiryResult,
  BankListResult,
  RawToken,
  Token
} from './index.d.js'
import { Mutex } from "async-mutex"
import { base64Encode } from "@/utils/bast64Util.js"

let TOKEN :Token
const mutex = new Mutex()

async function hello(): Promise<String> {
  const endPoint = 'api/v2/Hello'
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
        `httpCode: ${err.code ?? 'Empty httpCode'}`,
        `response: ${!err.response?.data ? "Empty data" : JSON.stringify(err.response.data)}`,
      )
      throw new Error(err.response?.data.ResponseMessage ?? err.message ?? err.code)
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

async function _requestToken(): Promise<Token|null> {
  const credential = CREDENTIAL
  const endPoint = `api/v2/Authenticate?Agency_Code=${credential.AGENCY_CODE}`
  const basicAuth = base64Encode(`${credential.USERNAME}:${credential.PASSWORD}`)
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${basicAuth}`,
  }
  try {
    const axiosResponse = await getAxios().post(
      endPoint,
      {},
      {
        headers
      }
    ) as AxiosResponse<RawToken, any>
    const rawToken = axiosResponse.data
    LOGGER.info('nbp', 'token update', `expires_in: ${new Date(rawToken.Token_Expiry)}`)
    return {
      ...rawToken,
      Token_Expiry: new Date(rawToken.Token_Expiry)
    }
  } catch (err) {
    if ( err instanceof AxiosError ) {
      LOGGER.error(
        'nbp', 
        'function: _requestToken', 
        `httpCode: ${err.code ?? 'Empty httpCode'}`,
        `response: ${!err.response?.data ? "Empty data" : JSON.stringify(err.response.data)}`,
      )
    } else {
      LOGGER.error(
        'nbp', 
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
    if ( !TOKEN || new Date().getTime() + 30000 > TOKEN.Token_Expiry.getTime() ) {
      const release = await mutex.acquire()
      try {
        if (!TOKEN || new Date().getTime() + 30000 > TOKEN.Token_Expiry.getTime() ) {
          const newToken = await _requestToken()
          if (!newToken) continue
          TOKEN = newToken
        }
      } catch (err) {
        LOGGER.error('nbp', 'function: _getToken', err)
      } finally {
        release()
      }
    }
    return TOKEN
  }
  return null
}

async function bankList(): Promise<BankListResult> {
  const endPoint = 'api/v2/BankList'
  const credential = CREDENTIAL
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
  const token = await _getToken()
  if (!token) throw new Error('Fail to fetch acotia_rtp access token.')

  const defaultRequest = {
    'Token': token.Token,
    'Agency_Code': credential.AGENCY_CODE
  }

  try {
    const response = await getAxios().post(
      endPoint,
      {
        ...defaultRequest
      },
      {
        headers
      }
    ) as AxiosResponse<BankListResult>
      return response.data
  } catch (err) {
    if ( err instanceof AxiosError ) {
      LOGGER.error(
        'nbp', 
        'function: bankList',
        `httpCode: ${err.code ?? 'Empty httpCode'}`,
        `response: ${!err.response?.data ? "Empty data" : JSON.stringify(err.response.data)}`,
      )
      throw new Error(err.response?.data.ResponseMessage ?? err.message ?? err.code)
    } else {
      LOGGER.error(
        'nbp', 
        'function: bankList', 
        JSON.stringify(err)
      )
      throw new Error("NBP Connection Fail")
    }
  }
}

async function accountEnquiry(
  request: AccountEnquiryRequest
): Promise<AccountEnquiryResult> {
  const endPoint = 'api/v2/AccountEnquiry'
  const credential = CREDENTIAL
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
  const token = await _getToken()
  if (!token) throw new Error('Fail to fetch acotia_rtp access token.')

  const defaultRequest = {
    'Token': token.Token,
    'Agency_Code': credential.AGENCY_CODE
  }

  try {
    const response = await getAxios().post(
      endPoint,
      {
        ...defaultRequest,
        ...request
      },
      {
        headers
      }
    ) as AxiosResponse<AccountEnquiryResult>
      return response.data
  } catch (err) {
    if ( err instanceof AxiosError ) {
      LOGGER.error(
        'nbp', 
        'function: accountEnquiry',
        `httpCode: ${err.code ?? 'Empty httpCode'}`,
        `response: ${!err.response?.data ? "Empty data" : JSON.stringify(err.response.data)}`,
      )
      throw new Error(err.response?.data.ResponseMessage ?? err.message ?? err.code)
    } else {
      LOGGER.error(
        'nbp', 
        'function: accountEnquiry', 
        JSON.stringify(err)
      )
      throw new Error("NBP Connection Fail")
    }
  }
}

// async function loadRemittanceCash(
//   request: 
// )