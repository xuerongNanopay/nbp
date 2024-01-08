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