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
  ['ResponseCode']: string
  ['ResponseMessage']: string
  ['IBAN']?: string
  ['AccountNo']?: string
  ['AccountTitle']?: string
  ['BranchCode']?: number
  ['AccountStatus']?: string
  ['BankName']?: string
}

interface LoadRemittanceRequest {
  ['Global_Id']: string
  ['Currency']: 'PKR'
  ['Amount']: number
  ['Pmt_Mode']: 'CASH' | 'ACCOUNT_TRANSFERS' | 'THIRD_PARTY_PAYMENTS'
  ['Remitter_Name']: string
  ['Remitter_Address']: string
  ['Remitter_Email']?: string
  ['Remitter_Contact']?: string
  ['Remitter_Id_Type']: 'PASSPORT_NO' | 'IQAMA_NO' | 'DRIVING_LICENSE' | 'OTHER'
  ['Remitter_Id']: string
  ['Beneficiary_Name']: string
  ['Beneficiary_Address']?: string
  ['Beneficiary_Contact']?: string
  ['Beneficiary_Expectedid']?: string
  ['Beneficiary_Bank']: string
  ['Beneficiary_Branch']?: string
  ['Beneficiary_Account']?: string
  ['Purpose_Remittance']: string
  ['Beneficiary_City']?: string
  ['Originating_Country']: string
  ['Transaction_Date']: string
  ['remitter_AccountNo']?: string
  ['remitter_FatherName']?: string
  ['remitter_DOB']?: string
  ['remitter_POB']?: string
  ['remitter_Nationality']?: string
  ['remitter_BeneficiaryRelationship']?: string
}

export type LoadRemittanceCashRequest = LoadRemittanceRequest & {
  ['Pmt_Mode']: 'CASH'
  ['Beneficiary_Bank']: 'NBP'
}

export type LoadRemittanceAccountsRequest = LoadRemittanceRequest & {
  ['Pmt_Mode']: 'ACCOUNT_TRANSFERS'
  ['Beneficiary_Bank']: 'NBP'
  ['Beneficiary_Branch']: string
  ['Beneficiary_Account']: string
}

export type LoadRemittanceAccountsRequest = LoadRemittanceRequest & {
  ['Pmt_Mode']: 'THIRD_PARTY_PAYMENTS'
  ['Beneficiary_Branch']: string
  ['Beneficiary_Account']: string
}

export interface LoadRemittanceResult {
  ['ResponseCode']: string
  ['ResponseMessage']: string
  ['Global_Id']: string
  ['Tracking_Id']?: string
}