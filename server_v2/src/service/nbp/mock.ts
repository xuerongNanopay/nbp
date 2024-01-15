import { NBPService } from "./index.js";
import type { 
  BankListResult,
  AccountEnquiryRequest,
  AccountEnquiryResult,
  LoadRemittanceResult,
  LoadRemittanceCashRequest,
  LoadRemittanceAccountsRequest,
  LoadRemittanceThirdPartyRequest,
  TransactionStatusByDateResult,
  TransactionStatusByIdsResult,
  TransactionStatusResult
} from "@/partner/nbp/index.d.js"

export const MockNBPService: NBPService = {
  hello: async (): Promise<string> => {
    return "Welcome, NBP E-Remittance API"
  },
  bankList: async (): Promise<BankListResult> => {
    return {
      ResponseCode: "201",
      ResponseMessage: "Bank list retrieved successfully",
      banklist: [
        {
          BankName: "ALLIED BANK LIMITED",
          BankAbbr: "ABL"
        }
      ]
    }
  }, 
  accountEnquiry: async (request: AccountEnquiryRequest): Promise<AccountEnquiryResult> => {
    return {
      ResponseCode: "201",
      ResponseMessage: "Account Details retrieved successfully",
      AccountNo: request.AccountNo,
      IBAN: request.AccountNo,
      BankName: request.BankName,
    }
  },
  loadRemittanceCash: async (request: LoadRemittanceCashRequest): Promise<LoadRemittanceResult> => {
    return {
      ResponseCode: "201",
      ResponseMessage: "Remittance Loaded successfully.",
      Tracking_Id: "20210615-15",
      Global_Id: request.Global_Id,
    }
  },
  loadRemittanceAccounts: async (request: LoadRemittanceAccountsRequest): Promise<LoadRemittanceResult> => {
    return {
      ResponseCode: "201",
      ResponseMessage: "Remittance Loaded successfully.",
      Tracking_Id: "20210615-15",
      Global_Id: request.Global_Id,
    }
  },
  loadRemittanceThirdParty: async (request: LoadRemittanceThirdPartyRequest): Promise<LoadRemittanceResult> => {
    return {
      ResponseCode: "201",
      ResponseMessage: "Remittance Loaded successfully.",
      Tracking_Id: "20210615-15",
      Global_Id: request.Global_Id,
    }
  },
  transactionStatusByDate: async (date: string): Promise<TransactionStatusByDateResult> => {
    return {
      ResponseCode: "201",
      ResponseMessage: "Remittance status retrieved successfully",
      transactionStatuses: []
    }
  },
  transactionStatusByIds: async (...ids: string[]): Promise<TransactionStatusByIdsResult> => {
    return {
      ResponseCode: "201",
      ResponseMessage: "Remittance status retrieved successfully",
      transactionStatuses: ids.map<TransactionStatusResult>((i) => ({
        Global_Id: i,
        Tracking_Id: "20210616-12",
        Status: "PAID",
        Status_Details: "Transaction is paid successfully",
        Beneficiary_Id_Type: "OTHER",
        Beneficiary_Id_Number: "3000207393",
        Branch_Code: 2,
        Branch_Name: "Main Branch Karachi",
        Beneficiary_Id_Expiry_Date: "",
        Beneficiary_Date_Of_Birth: "",
        Processing_Date: "20210616",
        Processing_Time: "13:46:42"
      }))
    }
  }
}