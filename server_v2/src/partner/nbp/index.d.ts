interface NBPOptions {
  baseUrl: string
  agencyCode: number
  username: string
  password: string
  authenticate
}

interface HTTPResponse<T extends NBPResponse> {
  httpCode: number
  data: T
}

interface NBPResponse {
  ResponseCode: string
  ResponseMessage: string
}

interface BankList extends NBPResponse {
  banklist: BankListItem[]
}

interface BankListItem {
  BankName: string
  BankAbbr: string
}

interface AccountEnquiry extends NBPResponse {
  IBAN?: string
  AccountNo?: string
  AccountTitle?: string
  BranchCode?: number
  AccountStatus?: string
  BankName?: string
}

interface LoadRemittance extends NBPResponse {
  Global_Id: string
  Currency: string
  Amount: string
  //TODO: move to subclass
  Pmt_Mode: string
  Remitter_Name: string
  Remitter_Address: string
  Remitter_Email?: string
  Remitter_Contact?: string
  Remitter_Id_Type: "PASSPORT_NO" | "IQAMA_NO" | "DRIVING_LICENSE" | "OTHER"
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