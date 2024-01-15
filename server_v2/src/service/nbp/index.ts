import type { 
  BankListResult,
  AccountEnquiryRequest,
  AccountEnquiryResult,
  LoadRemittanceResult,
  LoadRemittanceCashRequest,
  LoadRemittanceAccountsRequest,
  LoadRemittanceThirdPartyRequest,
  TransactionStatusByDateResult,
  TransactionStatusByIdsResult
} from "@/partner/nbp/index.d.js"
import { MockNBPService } from "./mock.js"

//TODO: Mock Service for development mode
// export const NBPService = await _getRealService()
export const NBPService = MockNBPService

export interface NBPService {
  hello(): Promise<string>
  bankList(): Promise<BankListResult> 
  accountEnquiry(request: AccountEnquiryRequest): Promise<AccountEnquiryResult>
  loadRemittanceCash(request: LoadRemittanceCashRequest): Promise<LoadRemittanceResult>
  loadRemittanceAccounts(request: LoadRemittanceAccountsRequest): Promise<LoadRemittanceResult>
  loadRemittanceThirdParty(request: LoadRemittanceThirdPartyRequest): Promise<LoadRemittanceResult>
  transactionStatusByDate(date: string): Promise<TransactionStatusByDateResult>
  transactionStatusByIds(...ids: string[]): Promise<TransactionStatusByIdsResult>
}

async function _getRealService(): Promise<NBPService> {
  const nbp =  await import('@/partner/nbp/index.js')
  return {
    hello: nbp.hello,
    bankList: nbp.bankList,
    accountEnquiry: nbp.accountEnquiry,
    loadRemittanceCash: nbp.loadRemittanceCash,
    loadRemittanceAccounts: nbp.loadRemittanceAccounts,
    loadRemittanceThirdParty: nbp.loadRemittanceThirdParty,
    transactionStatusByDate: nbp.transactionStatusByDate,
    transactionStatusByIds: nbp.transactionStatusByIds
  }
}