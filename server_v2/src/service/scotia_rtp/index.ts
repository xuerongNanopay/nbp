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
  RequestForPaymentResult
} from "@/partner/scotia_rtp/index.d.js";

interface ScotiaRTPService {
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