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

export interface Token {
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
            ['number']?: string
            // YYYY-MM-DD
            ['related_date']?: string
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
      ['customer_ip_address']?: string
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

export interface RTPPaymentSummaryResult {
  ['data']?: {
    ['clearing_system_reference']: string
    ['product_code']: 'DOMESTIC'
    ['payment_type']: 'ACCOUNT_ALIAS_PAYMENT' | 'REAL_TIME_ACCOUNT_ALIAS_PAYMENT' | 'ACCOUNT_DEPOSIT_PAYMENT' | 'REAL_TIME_ACCOUNT_DEPOSIT_PAYMENT'
    ['request_date']: Date
    ['amount']: {
      ['amount']: number
      ['currency']: string
    }
    ['receiving_channel_indicator']: 'ETRANSFER_SYSTEM'
    ['payment_status']?: 'INITIATED' | 'DIRECT_DEPOSIT_PENDING' | 'DIRECT_DEPOSIT_FAILED' | 'COMPLETED' | 'REALTIME_INITIATED' | 'REALTIME_DEPOSIT_COMPLETED' | 'REALTIME_DEPOSIT_FAILED'
    ['expiry_date']: Date
    ['payment_id']: string
    ['sender_memo']?: string
    ['originating_channel_indicator']?: 'ONLINE'
    ['request_for_payment_reference']?: string
    ['payment_schedule_reference']?: string
    ['contact_outgoing_details']: {
      ['contact_id']?: string
      ['contact_type']: string
      ['alias_name']: string
      ['legal_name']?: {
        ['retail_name']?: {
          ['first_name']: string
          ['middle_name']?: string
          ['last_name']: string
        }
        ['business_name']?: {
          ['company_name']: string
          ['trade_name']?: string
        }
      }
      ['notification_preference']?: {
        ['type']: 'Email' | 'SMS' | 'RN'
        ['active']: boolean
      }[]
    }
    ['account_alias_reg_details']?: {
      ['account_alias_handle']: string
      ['service_type']: 'EMAIL'
      ['sender_account_identifier']?: string
    }
    ['authentication_type']: 'NOT_REQUIRED'
    ['customer_account']: {
      ['fi_account_id']?: string
      ['account_holder_name']: string
      ['bank_account_identifier']: {
        ['type']: 'CANADIAN'
        ['account']: string
      }
    }
    ['additional_remittance_info']: 'NOT_PROVIDED' | 'ADVICE_DETAILS' | 'LOCATION_DETAILS' | 'ADVICE_AND_LOCATION_DETAILS'
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

export interface RequestForPaymentRequest {
  ['data']: {
    ['product_code']?: 'DOMESTIC'
    ['message_identification']: string
    ['end_to_end_identification']: string
    ['credit_debit_indicator']: 'CRDT' | 'DBIT'
    ['creation_date_time']: string
    ['payment_expiry_date']?: string
    ['language']: 'EN' | 'FR'
    ['instructed_amount']: {
      ['amount']: number
      ['currency']: string
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
      ['contact_details']?: {
        ['name']?: string
        ['phone_number']?: string
        ['mobile_number']?: string
        ['fax_number']?: string
        ['email_address']?: string
      }
    }
    ['ultimate_debtor']?: {
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
    },
    ['creditor']: {
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
    ['creditor_account']: {
      ['identification']: string
      ['currency']?: string
      ['scheme_name']?: string
    }
    ['ultimate_creditor']?: {
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
      ['customer_ip_address']?: string
    }
    ['payment_type_information']: {
      ['category_purpose']: {
        ['code']: 'BONU' | 'CASH' | 'CBLK' | 'CCRD' | 'CORT' | 'DCRD' | 'DIVI' | 'DVPM' | 'EPAY' | 'FCIN' | 'FCOL' | 'GP2P' | 'GOVT' | 'HEDG' | 'ICCP' | 'IDCP' | 'INTC' | 'INTE' | 'LBOX' | 'LOAN' | 'MP2B' | 'MP2P' | 'OTHR' | 'PENS' | 'RPRE' | 'RRCT' | 'RVPM' | 'SALA' | 'SECU' | 'SSBE' | 'SUPP' | 'TAXS' | 'TRAD' | 'TREA' | 'VATX' | 'WHLD' | '240' | '260' | '308' | '311' | '318' | '330' | '370' | '400' | '430' | '452' | '460' | '480'
      }
    }
    ['enclosed_file']?: {
      ['type']: {
        ['code']: 'CINV' | 'CNFA' | 'CONT' | 'CREN' | 'DEBN' | 'DISP' | 'DNFA' | 'HIRI' | 'INVS' | 'MSIN' | 'PROF' | 'PUOR' | 'QUOT' | 'SBIN' | 'SPRR' | 'TISH' | 'USAR'
      }
      ['identification']: string
      ['issue_date']: Date
      ['name']?: string
      ['format']: {
        ['code']: 'DPDF' | 'DXML' | 'SDSH' | 'WORD' | 'XSLT'
      }
      ['file_name']?: string
      // ['enclosure']: Uint8Array
    }
  }
}

export interface RequestForPaymentResult {
  ['data']?: {
    ['payment_id']: string
    ['clearing_system_reference']: string
  },
  ['notifications']?: {
    ['severity']?: string
    ['code']?: string
    ['message']?: string
    ['uuid']?: string
    ['timestamp']?: string
    ['metadata']?: any
  }[]
}

//TODO: ask for API docs.
export interface RequestForPaymentStatusResult {
  ['data']?: {
    ['payment_id']?: string
    ['request_reference']?: string
    ['request_amount']?: {
      ['amount']: number
      ['currency']: string
    },
    ['partial_fulfillment_allowed']: boolean,
    ['request_date']: string
    ['expiry_date']: string
    ['request_status']: string
    ['gateway_url']: string
  }[],
  ['notifications']?: {
    ['severity']?: string
    ['code']?: string
    ['message']?: string
    ['uuid']?: string
    ['timestamp']?: string
    ['metadata']?: any
  }[]
}

export interface RequestForPaymentDetailResult {
  ['data']?: {
    ['creation_datetime']: string
    ['original_creation_datetime']?: string
    ['original_end_to_end_identification']: string
    ['transaction_status']: 'ACTC' | 'PDNG' | 'ACSP' | 'RJCT',
    ['acceptance_datetime']?: string
    ['clearing_system_reference']?: string
    ['amount']: {
      ['instructed_amount']: {
        ['amount']: number
        ['currency']: string
      }
    }
    ['requested_execution_date']: string
    ['expiry_date']: string
    ['payment_type_information']?: {
      ['category_purpose']: {
        ['code']: 'BONU' | 'CASH' | 'CBLK' | 'CCRD' | 'CORT' | 'DCRD' | 'DIVI' | 'DVPM' | 'EPAY' | 'FCIN' | 'FCOL' | 'GP2P' | 'GOVT' | 'HEDG' | 'ICCP' | 'IDCP' | 'INTC' | 'INTE' | 'LBOX' | 'LOAN' | 'MP2B' | 'MP2P' | 'OTHR' | 'PENS' | 'RPRE' | 'RRCT' | 'RVPM' | 'SALA' | 'SECU' | 'SSBE' | 'SUPP' | 'TAXS' | 'TRAD' | 'TREA' | 'VATX' | 'WHLD' | '240' | '260' | '308' | '311' | '318' | '330' | '370' | '400' | '430' | '452' | '460' | '480'
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
            ['number']?: string
            // YYYY-MM-DD
            ['related_date']?: string
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
        ['additional_remittance_information']: string[]
      }[]
    }
    ['enclosed_file']?: {
      ['type']: {
        ['code']: 'CINV' | 'CNFA' | 'CONT' | 'CREN' | 'DEBN' | 'DISP' | 'DNFA' | 'HIRI' | 'INVS' | 'MSIN' | 'PROF' | 'PUOR' | 'QUOT' | 'SBIN' | 'SPRR' | 'TISH' | 'USAR'
      }
      ['identification']: string
      ['issue_date']: string
      ['name']?: string
      ['format']: {
        ['code']: 'DPDF' |'DXML' | 'SDSH' | 'WORD' | 'XSLT'
      }
      ['file_name']: string
      ['enclosure']: string //byte
    }[]
    ['ultimate_debtor']?: {
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
    },
    ['debtor']?: {
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
      ['contact_details']: {
        ['name']: string
        ['phone_number']?: string
        ['mobile_number']?: string
        ['fax_number']?: string
        ['email_address']?: string
      }
    }
    ['debtor_account']?: {
      ['identification']: {
        ['other']?: {
          ['identification']: string
        }
      }
    }
    ['debtor_agent']?: {
      ['financial_institution_identification']: {
        ['bicfi']?: string
        ['clearing_system_member_identification']?: {
          ['member_identification']: string
        }
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
        ['other']?: {
          ['identification']: string
          ['scheme_name']: {
            ['code']: string
            ['proprietary']: string
          }
          ['issuer']: string
        }
      }
    }
    ['creditor_agent']: {
      ['financial_institution_identification']: {
        ['bicfi']?: string
        ['clearing_system_member_identification']?: {
          ['member_identification']: string
        }
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
        ['other']?: {
          ['identification']: string
          ['scheme_name']: {
            ['code']: string
            ['proprietary']: string
          }
          ['issuer']: string
        }
      }
    }
    ['creditor']?: {
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
          ['identification']?: string
          ['scheme_name']: {
            ['proprietary']: 'ALIAS_ACCT_NO' | 'BANK_ACCT_NO'
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
    ['ultimate_creditor']?: {
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
      ['contact_details']: {
        ['name']: string
        ['phone_number']?: string
        ['mobile_number']?: string
        ['fax_number']?: string
        ['email_address']?: string
      }
    }
    ['request_for_payment_status']: 'INITIATED' | 'AVAILABLE_TO_BE_FULFILLED' | 'FULFILLED' | 'DECLINED' | 'CANCELLED' | 'EXPIRED' | 'DEPOSIT_FAILED' | 'DEPOSIT_COMPLETE'
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

export interface RequestForCancelPaymentRequest {
  'cancel_reason'?: string
}

export interface RequestForCancelResult {
  ['data']: {
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

export interface RTPHookRequest {
  ['sub']?: string
  ['aud']?: string
  ['payment_id']: string
  ['iss']?: string
  ['event_name']?: string
  ['new_status']?: string
  ['exp']?: number
  ['iat']?: number
}
//TODO: find API
// export interface AccountValidationRequest {
//   ['accountInformation']: {
//     ['institution_number']: string
//     ['transit']: string
//     ['account_number']: string
//     ['currency_code']: string
//     ['transaction_type']: string
//   }
// }

// export interface AccountValidationResult {
//   ['data']?: {
    
//   }
// }