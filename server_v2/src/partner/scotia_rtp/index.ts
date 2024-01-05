//PUT Everything in one file now. I am lazy💀

import { base64Encode } from "@/utils/bast64Util.js"
import axios from "axios"
import type { Credential } from "./index.d.js"

// No sure if this is GET or POST.
async function getToken(credential: Credential) {
  //TODO: in config
  const endpoint = '/wam/v1/getToken'
  const formData = new FormData()
  formData.append("grant_type", encodeURIComponent("client_credentials"))
  formData.append("scope", encodeURIComponent(credential.SCOPE))
  formData.append("client_id", encodeURIComponent(credential.CLIENT_ID))
  formData.append("client_assertion", encodeURIComponent(credential.CLIENT_ASSERTION))
  formData.append("client_assertion_type", encodeURIComponent(credential.CLIENT_ASSERTION_TYPE))

  const response = await axios.post(
    endpoint,
    formData,
    {
      headers: {
        'Authorization': `Bearer ${base64Encode(`${credential.API_KEY}:${credential.API_SECRET}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  )
}

function rtpPaymentOption() {

}

function rtpPayment() {

}

function rtpPaymentSummary() {

}

function requestForPayment() {

}

function requestForPaymentDetails() {

}

function cancelRequestForPayment() {

}