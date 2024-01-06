export interface RequestHeader {
  ['x-api-key']: string
  ['x-b3-traceid']: string
  ['x-b3-spanid']: string
  ['x-country-code']: string
  ['customer-profile-id']: string
  ['Authorization']: string
}

export interface Credential {
  ['API_KEY']: string
  ['API_SECRET']: string
  ['SCOPE']: string
  ['GRAND_TYPE']: string
  ['CLIENT_ID']: string
  ['CLIENT_ASSERTION']: string
  ['CLIENT_ASSERTION_TYPE']: string
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

export interface Token extends RawToken {
  ['access_token']: string
  ['scope']: string
  ['token_type']: string
  ['expires_in']: Date
}