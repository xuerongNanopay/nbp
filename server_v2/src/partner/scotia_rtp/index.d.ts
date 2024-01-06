export interface OptionHeader {
  ['x-api-key']?: string
  ['x-b3-traceid']?: string
  ['x-b3-spanid']?: string
  ['x-country-code']?: string
  ['customer-profile-id']?: string
}

export interface Credential {
  ['API_KEY']: string
  ['API_SECRET']: string
  ['SCOPE']: string
  ['GRAND_TYPE']: string
  ['CLIENT_ID']: string
  ['CLIENT_ASSERTION']: string
  ['CLIENT_ASSERTION_TYPE']: string
  ['CUSTOMER_PROFILE_ID']: string
  ['X_COUNTRY_CODE']: string
  ['JWT_AUDIENCE']: string
  ['JWT_KID']: string
  ['JWT_EXPIRY']: string
}

export interface RawToken {
  ['access_token']: string
  ['scope']: string
  ['token_type']: string
  ['expires_in']: string
}

interface Reponse<T = any> {
  status: number
  statusMessage: string,
  data: T
}

export interface Token extends RawToken {
  ['access_token']: string
  ['scope']: string
  ['token_type']: string
  ['expires_in']: Date
}

export interface RTPPaymentOptionsRequest {
  ['product_code']: 'DOMESTIC',
  ['deposit_type']: 'EMAIL' | 'ACCOUNT_DEPOSIT'
  ['deposit_handle']: string
}

export interface RTPPaymentOptionsResult {
  ['data']?: {
    ['payment_options']?: {
      ['payment_type']?: 'REGULAR_PAYMENT' | 'ACCOUNT_ALIAS_PAYMENT' | 'REAL_TIME_ACCOUNT_ALIAS_PAYMENT' | 'ACCOUNT_DEPOSIT_PAYMENT' | 'REAL_TIME_ACCOUNT_DEPOSIT_PAYMENT'
      ['account_alias_reference']?: string
      ['sender_account_identifier_required']?: boolean
      ['sender_account_identifier_format']?: string
      ['sender_account_identifier_description']?: string
      ['max_payment_outgoing_amount']?: {
        ['amount']: string
        ['currency']: string
      }
      ['customer_type']?: 'RETAIL' | 'SMALL_BUSINESS' | 'CORPORATION'
      ['customer_name']?: {
        ['registration_name']: string
        ['legal_name']: {
          ['retail_name']?: {
            ['first_name']: string
            ['middle_name']?: string
            ['last_name']: string
          }
          ['business_name']: {
            ['company_name']?: string
            ['trade_name']: string
          }
        }
      }
    }[],
  }
  ['notifications']?: {
    ['severity']?: string
    ['code']?: string
    ['message']?: string
    ['uuid']?: string
    ['timestamp']?: string
    ['metadata']?: any
  }[]
}

export interface RTPPaymentRequest {
  ['initiation']: {
    ['product_code']: 'DOMESTIC'
    ['message_identification']: string
    ['end_to_end_identification']?: string
    ['number_of_transactions']: number
    ['credit_debit_indicator']?: 'CRDT' | 'DBIT'
    ['payment_type_identification']: 'ACCOUNT_ALIAS_PAYMENT' | 'REAL_TIME_ACCOUNT_ALIAS_PAYMENT' | 'ACCOUNT_DEPOSIT_PAYMENT' | 'REAL_TIME_ACCOUNT_DEPOSIT_PAYMENT'
    ['creation_date_time']: Date
    ['payment_expiry_date']?: Date
    ['language']: 'EN' | 'FR'
    ['instructed_amount']: {
      ['amount']: number
      ['currency']: 'CAD'
    }
    ['ultimate_debtor']?: {
      ['name']: string
      ['postal_address']?: {
        ['address_type']?: {
          ['code']: 'ADDR' | 'PBOX' | 'HOME' | 'BIZZ' | 'MLTO' | 'DLVY'
        }
        ['department']?: string
        ['sub_department']?: string
        ['street_name']?: string
        ['building_number']?: string
        ['post_code']?: string
        ['town_name']?: string
        ['country_sub_division']?: string
        ['country']?: string
        ['address_line']?: string
      }
      ['country_of_residence']?: string
      ['contact_details']: {
        ['name']: string
        ['phone_number']?: string
        ['mobile_number']?: string
        ['fax_number']?: string
        ['email_address']?: string
      }
    }
    ['debtor']: {
      ['name']: string
      ['postal_address']?: {
        ['address_type']?: {
          ['code']: 'ADDR' | 'PBOX' | 'HOME' | 'BIZZ' | 'MLTO' | 'DLVY'
        }
        ['department']?: string
        ['sub_department']?: string
        ['street_name']?: string
        ['building_number']?: string
        ['post_code']?: string
        ['town_name']?: string
        ['country_sub_division']?: string
        ['country']?: string
        ['address_line']?: string
      }
      ['country_of_residence']?: string
      ['contact_details']: {
        ['name']: string
        ['phone_number']?: string
        ['mobile_number']?: string
        ['fax_number']?: string
        ['email_address']?: string
      }
    }
    ['debtor_account']: {
      ['identification']: {
        ['other']?: {
          ['identification']: string
        }
      }
    }
    ['ultimate_creditor']?: {
      ['name']: string
      ['postal_address']?: {
        ['address_type']?: {
          ['code']: 'ADDR' | 'PBOX' | 'HOME' | 'BIZZ' | 'MLTO' | 'DLVY'
        }
        ['department']?: string
        ['sub_department']?: string
        ['street_name']?: string
        ['building_number']?: string
        ['post_code']?: string
        ['town_name']?: string
        ['country_sub_division']?: string
        ['country']?: string
        ['address_line']?: string
      }
      ['country_of_residence']?: string
      ['contact_details']: {
        ['name']: string
        ['phone_number']?: string
        ['mobile_number']?: string
        ['fax_number']?: string
        ['email_address']?: string
      }
    }
    ['creditor']: {
      ['name']: string
      ['postal_address']?: {
        ['address_type']?: {
          ['code']: 'ADDR' | 'PBOX' | 'HOME' | 'BIZZ' | 'MLTO' | 'DLVY'
        }
        ['department']?: string
        ['sub_department']?: string
        ['street_name']?: string
        ['building_number']?: string
        ['post_code']?: string
        ['town_name']?: string
        ['country_sub_division']?: string
        ['country']?: string
        ['address_line']?: string
      }
      ['country_of_residence']?: string
      ['contact_details']: {
        ['name']: string
        ['phone_number']?: string
        ['mobile_number']?: string
        ['fax_number']?: string
        ['email_address']?: string
      }
    }
    ['creditor_account']?: {
      ['identification']: {
        ['other']?: {
          ['identification']: string
          ['scheme_name']?: {
            ['proprietary']?: 'ALIAS_ACCT_NO' | 'BANK_ACCT_NO'
          }
        }
      }
      ['proxy']?: {
        ['type']: {
          ['proprietary']: 'EMAIL'
        }
        ['identification']: string
      }
    }
    ['remittance_information']?: {
      ['unstructured']?: string
      ['structured']?: {
        ['referred_document_information']?: {
          ['type']?: {
            ['code_or_proprietary']: {
              ['code']: 'MSIN' | 'CNFA' | 'DNFA' | 'CINV' | 'CREN' | 'DEBN' | 'HIRI' | 'SBIN' | 'CMCN' | 'SOAC' | 'DISP' | 'BOLD' | 'VCHR' | 'AROI' | 'TSUT' | 'PUOR'
            }
            ['number']: string
            // YYYY-MM-DD
            ['related_date']: string
          }
        }[]
        ['referred_document_amount']?: {
          ['due_payable_amount']?: {
            ['amount']: number
            ['currency']: string
          }
          ['adjustment_amount_and_reason']?: {
            ['amount']: {
              ['amount']: number
              ['currency']: string
            }
            ['credit_debit_indicator']?: 'CRDT' | 'DBIT'
            ['reason']: string
            ['additional_information']: string
          }[]
          ['remitted_amount']?: {
            ['amount']: number
            ['currency']: string
          }
        }
        ['creditor_reference_information']?: {
          ['type']: {
            ['code_or_proprietary']: {
              ['code']: 'RADM' | 'RPIN' | 'FXDR' | 'DISP' | 'PUOR' | 'SCOR'
            }
          }
          ['reference']: string
        }
        ['invoicer']?: {
          ['name']?: string
          ['postal_address']?: {
            ['address_type']?: {
              ['code']: 'ADDR' | 'PBOX' | 'HOME' | 'BIZZ' | 'MLTO' | 'DLVY'
            }
            ['department']?: string
            ['sub_department']?: string
            ['street_name']?: string
            ['building_number']?: string
            ['post_code']?: string
            ['town_name']?: string
            ['country_sub_division']?: string
            ['country']?: string
            ['address_line']?: string
          }
          ['country_of_residence']?: string
          ['contact_details']?: {
            ['name']?: string
            ['phone_number']?: string
            ['mobile_number']?: string
            ['fax_number']?: string
            ['email_address']?: string
          }
        }
        ['invoicee']?: {
          ['name']?: string
          ['postal_address']?: {
            ['address_type']?: {
              ['code']: 'ADDR' | 'PBOX' | 'HOME' | 'BIZZ' | 'MLTO' | 'DLVY'
            }
            ['department']?: string
            ['sub_department']?: string
            ['street_name']?: string
            ['building_number']?: string
            ['post_code']?: string
            ['town_name']?: string
            ['country_sub_division']?: string
            ['country']?: string
            ['address_line']?: string
          }
          ['country_of_residence']?: string
          ['contact_details']?: {
            ['name']?: string
            ['phone_number']?: string
            ['mobile_number']?: string
            ['fax_number']?: string
            ['email_address']?: string
          }
        }
      }[]
    }
    ['fraud_supplementary_info']: {
      ['customer_authentication_method']: 'PASSWORD' | 'PVQ' | 'FINGERPRINT' | 'BIO_METRICS' | 'OTP' | 'TOKEN' | 'NONE' | 'OTHER'
      ['customer_ip_address']: string
    }
  }
}

export interface RTPPaymentResult {
  ['data']?: {
    ['payment_id']: string
    ['clearing_system_reference']: string
    ['status']: 'SUCCESS' | 'FAILURE'
  }
  ['notifications']?: {
    ['severity']?: string
    ['code']?: string
    ['message']?: string
    ['uuid']?: string
    ['timestamp']?: string
    ['metadata']?: any
  }[]
}