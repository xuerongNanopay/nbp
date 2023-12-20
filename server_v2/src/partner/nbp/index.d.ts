interface NBPOptions {
  baseUrl: string
  agencyCode: number
  username: string
  password: string
}

interface NBPResponse {
  ResponseCode: string
  ResponseMessage: string
}

interface _Authenticate extends NBPResponse {
  Token: string
  Token_Expiry: Date
}

interface BankListItem {
  BankName: string
  BankAbbr: string
}

interface BankList extends NBPResponse {
  banklist: BankListItem[]
}

interface AccountEnquiry extends NBPResponse {
  IBAN?: string
  AccountNo?: string
  AccountTitle?: string
  BranchCode?: number
  AccountStatus?: string
  BankName?: string
}

interface HTTPResponse<T extends NBPResponse> {
  httpCode: number
  data: T
}

interface NBPRequest {
  Token: string
  Agency_Code: string
}

interface AccountEnquiryReq extends NBPRequest {
  AccountNo: string
  BranchCode?: string
  BankName: string
}


interface NBPClient {
  hello: () => void
  accountEnquiry: () => void
  bankList: () => void
  loadRemittanceCash: () => void
  loadRemittanceAccounts: () => void
  loadRemittanceThirdParty: () => void
  cancelTransaction: () => void
  transactionStatus: () => void
  rransactionStatusByIds: () => void
}