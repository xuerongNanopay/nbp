import { 
  RequestForPaymentResult,
  RequestForPaymentStatusResult,
  RequestForPaymentDetailResult,
  RTPPaymentOptionsResult
} from "@/partner/scotia_rtp/index.d.js";
import { 
  ReqeustForPaymentProp, 
  RequestForPaymentStatusProp, 
  RequestForPaymentDetailsProp,
  RTPPaymentOptionsProp,
  ScotiaRTPService 
} from "./index.js";

export const MockScotiaRTPService: ScotiaRTPService = {
  requestForPayment: async (prop: ReqeustForPaymentProp): Promise<RequestForPaymentResult> => {
    return {
      data: {
        payment_id: `RTP-payment_id-${prop.transactionId}`,
        clearing_system_reference: `RTP-clearing_system_reference-${prop.transactionId}`
      }
    }
  },
  requestForPaymentStatus: async (prop: RequestForPaymentStatusProp): Promise<RequestForPaymentStatusResult> => {
    return {
      data: [
        {
          gateway_url: 'www.google.ca'
        }
      ]
    }
  },
  requestForPaymentDetails: async (prop: RequestForPaymentDetailsProp): Promise<RequestForPaymentDetailResult> => {
    // 80 percent of transaction will pass
    // This will allow us to test unhappy path as well.
    // const random_boolean = Math.random() < 0.8;
    const random_boolean = Math.random() < 1;
    return {
      data: {
        transaction_status: random_boolean ? 'ACSP' : 'RJCT',
        creation_datetime: new Date().toISOString(),
        amount: {
          instructed_amount: {
            amount: 111.11,
            currency: 'CAD'
          }
        },
        original_end_to_end_identification: `${prop.paymentId}`,
        requested_execution_date: 'Unknown',
        expiry_date: 'Unknown',
        creditor_agent: {
          financial_institution_identification: {}
        },
        request_for_payment_status: random_boolean ? 'FULFILLED' : 'DECLINED',
      }
    }
  },
  rtpPaymentOptions: async (prop: RTPPaymentOptionsProp): Promise<RTPPaymentOptionsResult> => {
    return {
      data: {
        payment_options: [
          {
            payment_type: 'REAL_TIME_ACCOUNT_ALIAS_PAYMENT'
          }
        ]
      }
    }
  },
  emailLookUp: async (email: string): Promise<RTPPaymentOptionsResult> => {
    return {
      data: {
        payment_options: [
          {
            payment_type: 'REAL_TIME_ACCOUNT_ALIAS_PAYMENT'
          }
        ]
      }
    }
  }
}