import { v4 as uuidv4 } from 'uuid'
import { RTP_CREDITOR_ACCOUNT_IDENTIFICATION, RTP_CREDITOR_NAME, RTP_PAYMENT_EXPIRY_MS, RTP_ULTIMATE_CREDITOR_EMAIL, RTP_ULTIMATE_CREDITOR_NAME } from "@/boot/env.js";
import type {
  RTPPaymentOptionsResult,
  RequestForPaymentDetailResult,
  RequestForPaymentRequest,
  RequestForPaymentResult,
  RequestForPaymentStatusResult
} from "@/partner/scotia_rtp/index.d.js";

import {
  requestForPayment, requestForPaymentDetails, requestForPaymentStatus, rtpPaymentOptions 
} from "@/partner/scotia_rtp/index.js"
import { LOGGER } from '@/utils/logUtil.js';

//TODO: refactor, service API should base on the feature. Make it simple to use.
//TODO: Mock Service for development mode
export const ScotiaRTPService = await _getRealService()

export interface ScotiaRTPService {
  requestForPayment(prop: ReqeustForPaymentProp): Promise<RequestForPaymentResult> 
  requestForPaymentStatus(prop: RequestForPaymentStatusProp): Promise<RequestForPaymentStatusResult> 
  requestForPaymentDetails(prop: RequestForPaymentDetailsProp): Promise<RequestForPaymentDetailResult>
  rtpPaymentOptions(prop: RTPPaymentOptionsProp): Promise<RTPPaymentOptionsResult>
  emailLookUp(email: string): Promise<RTPPaymentOptionsResult>
}

async function _getRealService(): Promise<ScotiaRTPService> {
  return {
    requestForPayment: _requestForPayment,
    requestForPaymentStatus: _requestForPaymentStatus,
    rtpPaymentOptions: _rtpPaymentOptions,
    requestForPaymentDetails: _requestForPaymentDetails,
    emailLookUp: _emailLookUp
  }
}

export type ReqeustForPaymentProp = {
  transactionId: number,
  create_date_time: Date,
  amount: number,
  debtor_name?: string,
  debtor_email: string,
  remittance_information?: string
}

async function _requestForPayment(
  prop: ReqeustForPaymentProp
): Promise<RequestForPaymentResult> {
  // Miss initiating_party?
  // Miss payment_condition?
  const request: RequestForPaymentRequest = {
    data: {
      product_code: 'DOMESTIC',
      message_identification: _transactionIdentifier(prop.transactionId),
      end_to_end_identification: _transactionIdentifier(prop.transactionId),
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
    ['x-b3-spanid']: _transactionIdentifier(prop.transactionId),
    ['x-b3-traceid']: _transactionIdentifier(prop.transactionId)
  })
}

export type RequestForPaymentStatusProp = {
  paymentId: string,
  transactionId: number
}

async function _requestForPaymentStatus(
  {
    paymentId,
    transactionId
  }: RequestForPaymentStatusProp
) {
  return await requestForPaymentStatus(paymentId, {
    ['x-b3-spanid']: _transactionIdentifier(transactionId),
    ['x-b3-traceid']: _transactionIdentifier(transactionId)
  })
}

export type RTPPaymentOptionsProp = {
  accountId?: number
  email: string
}

async function _rtpPaymentOptions(
  {email, accountId}: RTPPaymentOptionsProp
) {
  const rand16String = uuidv4().substring(0, 16)
  return await rtpPaymentOptions({
      product_code: 'DOMESTIC',
      deposit_type: 'EMAIL',
      deposit_handle: email
    },
    {
      ['x-b3-spanid']: rand16String,
      ['x-b3-traceid']: rand16String
    }
  )
}

export type RequestForPaymentDetailsProp = {
  paymentId: string,
  transactionId: number
}

async function _requestForPaymentDetails(
  {transactionId, paymentId}: RequestForPaymentDetailsProp
) : Promise<RequestForPaymentDetailResult> {
  return await requestForPaymentDetails(paymentId,
    {
      ['x-b3-spanid']: _transactionIdentifier(transactionId),
      ['x-b3-traceid']: _transactionIdentifier(transactionId),
    }
  )
}

async function _emailLookUp(email: string): Promise<RTPPaymentOptionsResult> {
  try {
    return await _rtpPaymentOptions({email})
  } catch(err) {
    LOGGER.error('func: _emailLookUp', `look up email \`${email}\``, err)
    throw new Error(`Fail to look up email \`${email}\``)
  }
}

function _transactionIdentifier(transactionId: number) {
  const zero16 = '0000000000000000'
  const stringId = `${transactionId}`
  return `${zero16.substring(0, 16-stringId.length)}${stringId}`
}