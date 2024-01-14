export interface Credential {
  ['API_USER']: string
  ['API_KEY']: string
}

export interface TransferReqeust {
  ['man']?: string | null
  ['tea']?: string | null
  ['soc']?: string | null
  ['ip']?: string | null
  ['dfp']?: string | null
  ['dft']?: string | null
  ['bfn']?: string | null
  ['bmn']?: string | null
  ['bln']?: string | null
  ['bln2']?: string | null
  ['bgd']?: 'M' | 'F'
  ['bsn']?: string | null
  ['bco']?: string | null
  ['bz']?: string | null
  ['bc']?: string | null
  ['bs']?: string | null
  ['bnbh']?: string | null
  ['sfn']?: string | null
  ['sln']?: string | null
  ['ssn']?: string | null
  ['sco']?: string | null
  ['sz']?: string | null
  ['sc']?: string | null
  ['ss']?: string | null
  ['shipFromStreet']?: string | null
  ['shipFromCity']?: string | null
  ['shipFromState']?: string | null
  ['shipFromPostalCode']?: string | null
  ['shipFromCountry']?: string | null
  ['shipFromCounty']?: string | null
  ['sellerStreet']?: string | null
  ['sellerCity']?: string | null
  ['sellerState']?: string | null
  ['sellerPostalCode']?: string | null
  ['sellerCountry']?: string | null
  ['sellerCounty']?: string | null
  ['clong']?: string | null
  ['clat']?: string | null
  ['blg']?: string | null
  ['aflid']?: string | null
  ['aflsd']?: string | null
  ['phn']?: string | null
  ['pm']?: string | null
  ['pw']?: string | null
  ['tti']?: string | null
  ['tid']?: string | null
  ['pccn']?: string | null
  ['pcct']?: string | null
  ['pcty']?: string | null
  ['phash']?: string | null
  ['ptoken']?: string | null
  ['pach']?: string | null
  ['pbc']?: string | null
  ['profile']?: string | null
  ['smna']?: string | null
  ['m']?: string | null
  ['accountCreationTime']?: number | null
  ['sdcad']?: string[]
  ['ddcad']?: string[]
  ['dcth']?: string | null
  ['timezone']?: string | null
  ['cnbvot']?: string | null
  ['cnbvmi']?: string | null
  ['cnbvct']?: string | null
  ['cnbvrcn']?: string | null
  ['cnbvea']?: string | null
  ['cnbvrfcd']?: string | null
  ['nationality']?: string | null
  ['agent']?: string | null
  ['agentpln']?: string | null
  ['agentmln']?: string | null
  ['agentcurp']?: string | null
  ['agentrfc']?: string | null
  ['tags']?: string[]
  ['mcc']?: string | null
  ['useRiskMatrix']?: boolean
  ['cnv_rate']?: string | null
  ['moto']?: string | null
  ['pppe']?: string | null
  ['pppi']?: string | null
  ['ppps']?: string | null
  ['pppc']?: string | null
  ['amt']?: string | null
  ['ccy']?: string | null
  ['dman']?: string | null
  ['demail']?: string | null
  ['dph']?: string | null
  ['dpccn']?: string | null
  ['dpcct']?: string | null
  ['dphash']?: string | null
  ['dpppe']?: string | null
  ['dpppi']?: string | null
  ['dptoken']?: string | null
  ['dpach']?: string | null
  ['dpbc']?: string | null
  ['dassnl4']?: string | null
  ['ddob']?: string | null
  ['smid']?: string | null
  ['additionalParams']?: {
    [key:string]: any
  }
  ['retailer']?: string | null
  ['assnl4']?: string | null
  ['assn']?: string | null
  ['assn1']?: string | null
  ['assn2']?: string | null
  ['nationalId']?: string | null
  ['nationalIdMasked']?: string | null
  ['taxId']?: string | null
  ['taxIdMasked']?: string | null
  ['voterId']?: string | null
  ['voterIdMasked']?: string | null
  ['driverId']?: string | null
  ['driverIdMasked']?: string | null
  ['passportId']?: string | null
  ['passportIdMasked']?: string | null
  ['multiPayment']?: {
    [key:string]: any
  }
  ['getdNationalId']?: string | null
  ['getdNationalIdMasked']?: string | null
  ['getdTaxId']?: string | null
  ['getdTaxIdMasked']?: string | null
  ['getdVoterId']?: string | null
  ['getdVoterIdMasked']?: string | null
  ['getdDriverId']?: string | null
  ['getdDriverIdMasked']?: string | null
  ['getdPassportId']?: string | null
  ['getdPassportIdMasked']?: string | null
  ['retail_city']?: string | null
  ['retail_state']?: string | null
  ['retail_country']?: string | null
  ['retail_zip']?: string | null
  ['payment_source']?: string | null
  ['request_code']?: string | null
  //Memos
  [key:string]: any
}

export interface TransferResult {
  ['upr']?: string
  ['frp']?: string
  ['frn']?: string
  ['frd']?: string
  ['arpr']?: string
  ['arpid']?: string
  ['arpd']?: string
  ['tid']?: string
  ['erd']?: string
  ['res']?: string
  ['rcd']?: number[]
  ['ednaScoreCard']?: any
}