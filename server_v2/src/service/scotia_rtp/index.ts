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