export interface OptionHeader {
  ['x-api-key']?: string
  ['x-b3-traceid']?: string
  ['x-b3-spanid']?: string
  ['x-country-code']?: string
  ['customer-profile-id']?: string
}

export interface Credential {
  ['API_KEY']: string
  ['API_SECRET']: string
  ['SCOPE']: string
  ['GRAND_TYPE']: string
  ['CLIENT_ID']: string
  ['CLIENT_ASSERTION']: string
  ['CLIENT_ASSERTION_TYPE']: string
  ['CUSTOMER_PROFILE_ID']: string
  ['X_COUNTRY_CODE']: string
  ['JWT_AUDIENCE']: string
  ['JWT_KID']: string
  ['JWT_EXPIRY']: string
}

export interface RawToken {
  ['access_token']: string
  ['scope']: string
  ['token_type']: string
  ['expires_in']: string
}

interface Reponse<T = any> {
  status: number
  statusMessage: string,
  data: T
}

export interface Token extends RawToken {
  ['access_token']: string
  ['scope']: string
  ['token_type']: string
  ['expires_in']: Date
}

export interface PaymentOptionsRequest {
  ['product_code']: 'DOMESTIC',
  ['deposit_type']: 'EMAIL' | 'ACCOUNT_DEPOSIT',
  ['deposit_handle']: string
}