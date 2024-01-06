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
  ['deposit_type']: 'EMAIL' | 'ACCOUNT_DEPOSIT'
  ['deposit_handle']: string
}

export interface PaymentOptionsResult {
  ['data']: {
    ['payment_options']: {
      ['payment_type']: 'REGULAR_PAYMENT' | 'ACCOUNT_ALIAS_PAYMENT' | 'REAL_TIME_ACCOUNT_ALIAS_PAYMENT' | 'ACCOUNT_DEPOSIT_PAYMENT' | 'REAL_TIME_ACCOUNT_DEPOSIT_PAYMENT'
      ['account_alias_reference']: string
      ['sender_account_identifier_required']: boolean
      ['sender_account_identifier_format']: string
      ['sender_account_identifier_description']: string
      ['max_payment_outgoing_amount']: {
        ['amount']: string
        ['currency']: string
      }
      ['customer_type']: 'RETAIL' | 'SMALL_BUSINESS' | 'CORPORATION'
      ['customer_name']: {
        ['registration_name']: string
        ['legal_name']: {
          ['retail_name']: {
            ['first_name']: string
            ['middle_name']: string
            ['last_name']: string
          }
          ['business_name']: {
            ['company_name']: string
            ['trade_name']: string
          }
        }
      }
    }[],
  }
  ['notifications']: {
    ['severity']: string
    ['code']: string
    ['message']: string
    ['uuid']: string
    ['timestamp']: string
    ['metadata']?: any
  }[]
}