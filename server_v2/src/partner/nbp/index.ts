import { AxiosError, AxiosResponse } from "axios"
import { CREDENTIAL, getAxios } from "./config.js"
import { LOGGER } from "@/utils/logUtil.js"

import type {
  AccountEnquiryRequest,
  AccountEnquiryResult,
  BankListResult,
  LoadRemittanceAccountsRequest,
  LoadRemittanceCashRequest,
  LoadRemittanceResult,
  LoadRemittanceThirdPartyRequest,
  RawToken,
  Token,
  TransactionStatusByIdsResult,
  TransactionStatusResult
} from './index.d.js'
import { Mutex } from "async-mutex"
import { base64Encode } from "@/utils/bast64Util.js"
import { APIError } from "@/schema/error.js"

let TOKEN :Token
const mutex = new Mutex()

export async function hello(): Promise<string> {
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
        'NBP', 
        'function: hello',
        `httpCode: ${err.status ?? 'Empty httpCode'}`,
        `response: ${!err.response?.data ? "Empty Response" : JSON.stringify(err.response.data)}`,
        `request: ${!err.request ? "Empty Request" : JSON.stringify(err.request)}`
      )
      if ( !!err.response ) throw new APIError({httpCode: err.response.status, response: err.response.data, request: err.request})
      throw new Error(err.message ?? err.name ?? err.code)
    } else {
      LOGGER.error(
        'NBP', 
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
    LOGGER.info('NBP', 'token update', `expires_in: ${new Date(rawToken.Token_Expiry)}`)
    return {
      ...rawToken,
      Token_Expiry: new Date(rawToken.Token_Expiry)
    }
  } catch (err) {
    if ( err instanceof AxiosError ) {
      LOGGER.error(
        'NBP', 
        'function: _requestToken', 
        `httpCode: ${err.status ?? 'Empty httpCode'}`,
        `response: ${!err.response?.data ? "Empty Response" : JSON.stringify(err.response.data)}`,
        `request: ${!err.request ? "Empty Request" : JSON.stringify(err.request)}`
      )
    } else {
      LOGGER.error(
        'NBP', 
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
        LOGGER.error('NBP', 'function: _getToken', err)
      } finally {
        release()
      }
    }
    return TOKEN
  }
  return null
}

export async function bankList(): Promise<BankListResult> {
  const endPoint = 'api/v2/BankList'
  const credential = CREDENTIAL
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
  const token = await _getToken()
  if (!token) throw new Error('Fail to fetch nbp access token.')

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
        'NBP', 
        'function: bankList',
        `httpCode: ${err.status ?? 'Empty httpCode'}`,
        `response: ${!err.response?.data ? "Empty Response" : JSON.stringify(err.response.data)}`,
        `request: ${!err.request ? "Empty Request" : JSON.stringify(err.request)}`
      )
      if ( !!err.response ) throw new APIError({httpCode: err.response.status, response: err.response.data, request: err.request})
      throw new Error(err.message ?? err.name ?? err.code)
    } else {
      LOGGER.error(
        'NBP', 
        'function: bankList', 
        JSON.stringify(err)
      )
      throw new Error("NBP Connection Fail")
    }
  }
}

export async function accountEnquiry(
  request: AccountEnquiryRequest
): Promise<AccountEnquiryResult> {
  const endPoint = 'api/v2/AccountEnquiry'
  const credential = CREDENTIAL
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
  const token = await _getToken()
  if (!token) throw new Error('Fail to fetch nbp access token.')

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
        'NBP', 
        'function: accountEnquiry',
        `httpCode: ${err.status ?? 'Empty httpCode'}`,
        `response: ${!err.response?.data ? "Empty Response" : JSON.stringify(err.response.data)}`,
        `request: ${!err.request ? "Empty Request" : JSON.stringify(err.request)}`
      )
      if ( !!err.response ) throw new APIError({httpCode: err.response.status, response: err.response.data, request: err.request})
      throw new Error(err.message ?? err.name ?? err.code)
    } else {
      LOGGER.error(
        'NBP', 
        'function: accountEnquiry', 
        JSON.stringify(err)
      )
      throw new Error("NBP Connection Fail")
    }
  }
}

export async function loadRemittanceCash(
  request: LoadRemittanceCashRequest
): Promise<LoadRemittanceResult> {
  const endPoint = 'api/v2/LoadRemittanceCash'
  const credential = CREDENTIAL
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
  const token = await _getToken()
  if (!token) throw new Error('Fail to fetch nbp access token.')

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
    ) as AxiosResponse<LoadRemittanceResult>
      return response.data
  } catch (err) {
    if ( err instanceof AxiosError ) {
      LOGGER.error(
        'NBP', 
        'function: loadRemittanceCash',
        `httpCode: ${err.status ?? 'Empty httpCode'}`,
        `response: ${!err.response?.data ? "Empty Response" : JSON.stringify(err.response.data)}`,
        `request: ${!err.request ? "Empty Request" : JSON.stringify(err.request)}`
      )
      if ( !!err.response ) throw new APIError({httpCode: err.response.status, response: err.response.data, request: err.request})
      throw new Error(err.message ?? err.name ?? err.code)
    } else {
      LOGGER.error(
        'NBP', 
        'function: loadRemittanceCash', 
        JSON.stringify(err)
      )
      throw new Error("NBP Connection Fail")
    }
  }
}

export async function loadRemittanceAccounts(
  request: LoadRemittanceAccountsRequest
) : Promise<LoadRemittanceResult> {
  const endPoint = 'api/v2/LoadRemittanceAccounts'
  const credential = CREDENTIAL
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
  const token = await _getToken()
  if (!token) throw new Error('Fail to fetch nbp access token.')

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
    ) as AxiosResponse<LoadRemittanceResult>
      return response.data
  } catch (err) {
    if ( err instanceof AxiosError ) {
      LOGGER.error(
        'NBP', 
        'function: loadRemittanceAccounts',
        `httpCode: ${err.status ?? 'Empty httpCode'}`,
        `response: ${!err.response?.data ? "Empty Response" : JSON.stringify(err.response.data)}`,
        `request: ${!err.request ? "Empty Request" : JSON.stringify(err.request)}`
      )
      if ( !!err.response ) throw new APIError({httpCode: err.response.status, response: err.response.data, request: err.request})
      throw new Error(err.message ?? err.name ?? err.code)
    } else {
      LOGGER.error(
        'NBP', 
        'function: loadRemittanceAccounts', 
        JSON.stringify(err)
      )
      throw new Error("NBP Connection Fail")
    }
  }
}

export async function loadRemittanceThirdParty(
  request: LoadRemittanceThirdPartyRequest
): Promise<LoadRemittanceResult> {
  const endPoint = 'api/v2/LoadRemittanceThirdParty'
  const credential = CREDENTIAL
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
  const token = await _getToken()
  if (!token) throw new Error('Fail to fetch nbp access token.')

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
    ) as AxiosResponse<LoadRemittanceResult>
      return response.data
  } catch (err) {
    if ( err instanceof AxiosError ) {
      LOGGER.error(
        'NBP', 
        'function: loadRemittanceThirdParty',
        `httpCode: ${err.status ?? 'Empty httpCode'}`,
        `response: ${!err.response?.data ? "Empty Response" : JSON.stringify(err.response.data)}`,
        `request: ${!err.request ? "Empty Request" : JSON.stringify(err.request)}`
      )
      if ( !!err.response ) throw new APIError({httpCode: err.response.status, response: err.response.data, request: err.request})
      throw new Error(err.message ?? err.name ?? err.code)
    } else {
      LOGGER.error(
        'NBP', 
        'function: loadRemittanceThirdParty', 
        JSON.stringify(err)
      )
      throw new Error("NBP Connection Fail")
    }
  }
}

export async function transactionStatus(
  date: string
) : Promise<TransactionStatusResult> {
  const endPoint = 'api/v2/TransactionStatus'
  const credential = CREDENTIAL
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
  const token = await _getToken()
  if (!token) throw new Error('Fail to fetch nbp access token.')

  const defaultRequest = {
    'Token': token.Token,
    'Agency_Code': credential.AGENCY_CODE
  }

  try {
    const response = await getAxios().post(
      endPoint,
      {
        ...defaultRequest,
        Date: date
      },
      {
        headers
      }
    ) as AxiosResponse<TransactionStatusResult>
      return response.data
  } catch (err) {
    if ( err instanceof AxiosError ) {
      LOGGER.error(
        'NBP', 
        'function: transactionStatus',
        `httpCode: ${err.status ?? 'Empty httpCode'}`,
        `response: ${!err.response?.data ? "Empty Response" : JSON.stringify(err.response.data)}`,
        `request: ${!err.request ? "Empty Request" : JSON.stringify(err.request)}`
      )
      if ( !!err.response ) throw new APIError({httpCode: err.response.status, response: err.response.data, request: err.request})
      throw new Error(err.message ?? err.name ?? err.code)
    } else {
      LOGGER.error(
        'NBP', 
        'function: transactionStatus', 
        JSON.stringify(err)
      )
      throw new Error("NBP Connection Fail")
    }
  }
}

export async function transactionStatusByIds(
  ...ids: string[]
) : Promise<TransactionStatusByIdsResult> {
  const endPoint = 'api/v2/TransactionStatus'
  const credential = CREDENTIAL
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
  const token = await _getToken()
  if (!token) throw new Error('Fail to fetch nbp access token.')

  const defaultRequest = {
    'Token': token.Token,
    'Agency_Code': credential.AGENCY_CODE
  }

  try {
    const response = await getAxios().post(
      endPoint,
      {
        ...defaultRequest,
        ids: ids.join(',')
      },
      {
        headers
      }
    ) as AxiosResponse<TransactionStatusByIdsResult>
      return response.data
  } catch (err) {
    if ( err instanceof AxiosError ) {
      LOGGER.error(
        'NBP', 
        'function: transactionStatusByIds',
        `httpCode: ${err.status ?? 'Empty httpCode'}`,
        `response: ${!err.response?.data ? "Empty Response" : JSON.stringify(err.response.data)}`,
        `request: ${!err.request ? "Empty Request" : JSON.stringify(err.request)}`
      )
      if ( !!err.response ) throw new APIError({httpCode: err.response.status, response: err.response.data, request: err.request})
      throw new Error(err.message ?? err.name ?? err.code)
    } else {
      LOGGER.error(
        'NBP', 
        'function: transactionStatusByIds', 
        JSON.stringify(err)
      )
      throw new Error("NBP Connection Fail")
    }
  }
}