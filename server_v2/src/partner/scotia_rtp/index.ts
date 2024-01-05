//PUT Everything in one file now. I am lazy💀

import { base64Encode } from "@/utils/bast64Util.js"
import axios from "axios"
import type { AxiosResponse } from "axios"
import type { Credential, RawToken, Token } from "./index.d.js"
import { getCredential } from "./config.js"

//Mutex when request a new token.
let TOKEN :Token

// Request is core service for the API.
// If it is outage for long time or cannot recover. We need to raise emergency alert.
async function requestToken(): Promise<Token | null> {
  const credential = getCredential()
  //TODO: in config
  const endpoint = '/wam/v1/getToken'
  const formData = new FormData()
  formData.append("grant_type", encodeURIComponent("client_credentials"))
  formData.append("scope", encodeURIComponent(credential.SCOPE))
  formData.append("client_id", encodeURIComponent(credential.CLIENT_ID))
  formData.append("client_assertion", encodeURIComponent(signJWT(credential)))
  formData.append("client_assertion_type", encodeURIComponent(credential.CLIENT_ASSERTION_TYPE))

  const axiosResponse = await axios.post(
    endpoint,
    formData,
    {
      headers: {
        'Authorization': `Bearer ${base64Encode(`${credential.API_KEY}:${credential.API_SECRET}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  )

  //TODO: check response status
  if ( axiosResponse.status >> 7 === 1 ) {
    // Success
    const response = axiosResponse as AxiosResponse<RawToken, any>
    const rawToken = response.data
    return {
      ...rawToken,
      expires_in: new Date(rawToken.expires_in)
    }
  } else {
    // Fail
    //TODO: log the error.
    return null
  }
}

function signJWT(credential: Credential):string {

  return ''
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