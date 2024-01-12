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

//TODO: refactor, service API should base on the feature. Make it simple to use.
//TODO: Mock Service for development mode
export const ScotiaRTPService = await _getRealService()

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

async function _getRealService(): Promise<ScotiaRTPService> {
  const rtp =  await import('@/partner/scotia_rtp/index.js')
  return {
    rtpPaymentOptions: rtp.rtpPaymentOptions,
    rtpPayment: rtp.rtpPayment,
    rtpPaymentSummary: rtp.rtpPaymentSummary,
    requestForPayment: rtp.requestForPayment,
    requestForPaymentDetails: rtp.requestForPaymentDetails,
    cancelRequestForPayment: rtp.cancelRequestForPayment
  }
}

function _requestForPayment() {
  // Miss initiating_party?
  // Miss payment_condition?
  const request: RequestForPaymentRequest = {
    data: {
      product_code: 'DOMESTIC',
      message_identification: 'TODO: transactionID',
      end_to_end_identification: 'TODO: transactionID',
      credit_debit_indicator: 'CRDT',
      creation_date_time: new Date().toISOString(),
      //TODO: put into config. set up 2 hours as default.
      payment_expiry_date: new Date(new Date().getTime() + 7200000).toISOString(),
      // requestData.setSuppressResponderNotifications(credential.getSuppressResponderNotifications());
      // requestData.setReturnUrl("string"); // ????
      language: 'EN',
      instructed_amount: {
        amount: 0,    //TODO: remember divide by 100
        currency: 'CAD'
      },
      debtor: {
        name: 'Payer', //TODO: transaction ower name,
        country_of_residence: 'CA',
        contact_details: {
          email_address: 'TODO: user interac account email'
        }
      },
      creditor: {
        name: 'TODO: profile name',
        country_of_residence: 'CA',
        contact_details: {
          email_address: 'TODO: company email'
        }
      },
      creditor_account: {
        identification: 'TODO: void check?',
        currency: 'CAD',
        scheme_name: 'ALIAS_ACCT_NO'
      },
      ultimate_creditor: {
        name: 'TODO: payee name',
        country_of_residence: 'CA',
        contact_details: {
          email_address: 'TODO: who is email'
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
        unstructured: 'We request money from your'
      }
    }
  }
}