import { RTP_CREDITOR_ACCOUNT_IDENTIFICATION, RTP_CREDITOR_NAME, RTP_PAYMENT_EXPIRY_MS, RTP_ULTIMATE_CREDITOR_EMAIL, RTP_ULTIMATE_CREDITOR_NAME } from "@/boot/env.js";
import type { 
  OptionHeader, 
  RTPPaymentOptionsRequest,
  RTPPaymentOptionsResult,
  RTPPaymentRequest,
  RTPPaymentResult,
  RTPPaymentSummaryResult,
  RequestForCancelPaymentRequest,
  RequestForCancelResult,
  RequestForPaymentDetailResult,
  RequestForPaymentRequest,
  RequestForPaymentResult
} from "@/partner/scotia_rtp/index.d.js";

import {
  requestForPayment, requestForPaymentStatus, rtpPaymentOptions 
} from "@/partner/scotia_rtp/index.js"

//TODO: refactor, service API should base on the feature. Make it simple to use.
//TODO: Mock Service for development mode
// export const ScotiaRTPService = await _getRealService()

export interface ScotiaRTPService {
  rtpPaymentOptions(
    request: RTPPaymentOptionsRequest,
    optionHeaders: OptionHeader & Required<Pick<OptionHeader, 'x-b3-spanid' | 'x-b3-traceid'>>
  ): Promise<RTPPaymentOptionsResult> 
  rtpPayment(
    request: RTPPaymentRequest,
    optionHeaders: OptionHeader & Required<Pick<OptionHeader, 'x-b3-spanid' | 'x-b3-traceid'>>
  ): Promise<RTPPaymentResult> 
  rtpPaymentSummary(
    paymentId: string,
    optionHeaders: OptionHeader & Required<Pick<OptionHeader, 'x-b3-spanid' | 'x-b3-traceid'>>
  ): Promise<RTPPaymentSummaryResult>
  requestForPayment(
    request: RTPPaymentRequest,
    optionHeaders: OptionHeader & Required<Pick<OptionHeader, 'x-b3-spanid' | 'x-b3-traceid'>>
  ): Promise<RequestForPaymentResult>
  requestForPaymentDetails(
    paymentId: string,
    optionHeaders: OptionHeader & Required<Pick<OptionHeader, 'x-b3-spanid' | 'x-b3-traceid'>>
  ): Promise<RequestForPaymentDetailResult>
  cancelRequestForPayment(
    paymentId: string,
    request: RequestForCancelPaymentRequest,
    optionHeaders: OptionHeader & Required<Pick<OptionHeader, 'x-b3-spanid' | 'x-b3-traceid'>>
  ) : Promise<RequestForCancelResult>
}

// async function _getRealService(): Promise<ScotiaRTPService> {
//   const rtp =  await import('@/partner/scotia_rtp/index.js')
//   return {
//     rtpPaymentOptions: rtp.rtpPaymentOptions,
//     rtpPayment: rtp.rtpPayment,
//     rtpPaymentSummary: rtp.rtpPaymentSummary,
//     requestForPayment: rtp.requestForPayment,
//     requestForPaymentDetails: rtp.requestForPaymentDetails,
//     cancelRequestForPayment: rtp.cancelRequestForPayment
//   }
// }

type ReqeustForPaymentProp = {
  transactionId: string,
  create_date_time: Date,
  amount: number,
  debtor_name?: string,
  debtor_email: string,
  remittance_information?: string
}
async function _requestForPayment(
  prop: ReqeustForPaymentProp
) {
  // Miss initiating_party?
  // Miss payment_condition?
  const request: RequestForPaymentRequest = {
    data: {
      product_code: 'DOMESTIC',
      message_identification: `transaction-${prop.transactionId}`,
      end_to_end_identification: `transaction-${prop.transactionId}`,
      credit_debit_indicator: 'CRDT',
      creation_date_time: `${prop.create_date_time.toISOString()}`,
      payment_expiry_date: `${new Date(prop.create_date_time.getTime() + RTP_PAYMENT_EXPIRY_MS).toISOString()}`,
      // requestData.setSuppressResponderNotifications(credential.getSuppressResponderNotifications());
      // requestData.setReturnUrl("string"); // ????
      language: 'EN',
      instructed_amount: {
        amount: prop.amount,
        currency: 'CAD'
      },
      debtor: {
        name: prop.debtor_name ?? 'Payer', //TODO: transaction ower name,
        country_of_residence: 'CA',
        contact_details: {
          email_address: prop.debtor_email
        }
      },
      creditor: {
        name: RTP_CREDITOR_NAME,
        country_of_residence: 'CA',
        contact_details: {
          email_address: RTP_CREDITOR_NAME
        }
      },
      creditor_account: {
        identification: RTP_CREDITOR_ACCOUNT_IDENTIFICATION,
        currency: 'CAD',
        scheme_name: 'ALIAS_ACCT_NO'
      },
      ultimate_creditor: {
        name: RTP_ULTIMATE_CREDITOR_NAME,
        country_of_residence: 'CA',
        contact_details: {
          email_address: RTP_ULTIMATE_CREDITOR_EMAIL
        }
      },
      fraud_supplementary_info: {
        customer_authentication_method: 'PASSWORD'
      },
      payment_type_information: {
        category_purpose: {
          code: 'CASH'
        }
      },
      remittance_information: {
        unstructured: prop.remittance_information ?? 'We request money from your'
      }
    }
  }

  
  return await requestForPayment(request, {
    ['x-b3-spanid']: `${prop.transactionId}`,
    ['x-b3-traceid']: `${prop.transactionId}`
  })
}

type RequestForPaymentStatusProp = {
  paymentId: string,
  transactionId: string
}

async function _requestForPaymentStatus(
  {
    paymentId,
    transactionId
  }: RequestForPaymentStatusProp
) {
  return await requestForPaymentStatus(paymentId, {
    ['x-b3-spanid']: `transaction-${transactionId}`,
    ['x-b3-traceid']: `transaction-${transactionId}`
  })
}

type RTPPaymentOptionsProp = {
  accountId: number
  email: string
}

async function _rtpPaymentOptions(
  {email, accountId}: RTPPaymentOptionsProp
) {
  return await rtpPaymentOptions({
      product_code: 'DOMESTIC',
      deposit_type: 'EMAIL',
      deposit_handle: email
    },
    {
      ['x-b3-spanid']: `account-${accountId}`,
      ['x-b3-traceid']: `account-${accountId}`
    }
  )
}