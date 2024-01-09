export interface Credential {
  ['AGENCY_CODE']: string
  ['USERNAME']: string
  ['PASSWORD']: string
}

export interface RawToken {
  ['Token']: string
  ['Token_Expiry']: string
}

export interface Token {
  ['Token']: string
  ['Token_Expiry']: Date
}

export interface BankListResult {
  ['ResponseCode']: string
  ['ResponseMessage']: string
  ['banklist']: {
    ['BankName']: string
    ['BankAbbr']: string
  }[]
}

export interface AccountEnquiryRequest {
  ['AccountNo']: string
  ['BranchCode']?: string
  ['BankName']: string
}

export interface AccountEnquiryResult {
  ['IBAN']?: string
  ['AccountNo']?: string
  ['AccountTitle']?: string
  ['BranchCode']?: number
  ['AccountStatus']?: string
  ['BankName']?: string
}