import type { 
  BankListResult,
  AccountEnquiryRequest,
  AccountEnquiryResult,
  LoadRemittanceResult,
  LoadRemittanceCashRequest,
  LoadRemittanceAccountsRequest,
  LoadRemittanceThirdPartyRequest,
  TransactionStatusResult,
  TransactionStatusByIdsResult
} from "@/partner/nbp/index.d.js"

//TODO: Mock Service for development mode
const NBPService = await getRealService()

export interface NBPService {
  hello(): Promise<string>
  bankList(): Promise<BankListResult> 
  accountEnquiry(request: AccountEnquiryRequest): Promise<AccountEnquiryResult>
  loadRemittanceCash(request: LoadRemittanceCashRequest): Promise<LoadRemittanceResult>
  loadRemittanceAccounts(request: LoadRemittanceAccountsRequest): Promise<LoadRemittanceResult>
  loadRemittanceThirdParty(request: LoadRemittanceThirdPartyRequest): Promise<LoadRemittanceResult>
  transactionStatus(date: string): Promise<TransactionStatusResult>
  transactionStatusByIds(...ids: string[]): Promise<TransactionStatusByIdsResult>
}

async function getRealService(): Promise<NBPService> {
  const nbp =  await import('@/partner/nbp/index.js')
  return {
    hello: nbp.hello,
    bankList: nbp.bankList,
    accountEnquiry: nbp.accountEnquiry,
    loadRemittanceCash: nbp.loadRemittanceCash,
    loadRemittanceAccounts: nbp.loadRemittanceAccounts,
    loadRemittanceThirdParty: nbp.loadRemittanceThirdParty,
    transactionStatus: nbp.transactionStatus,
    transactionStatusByIds: nbp.transactionStatusByIds
  }
}