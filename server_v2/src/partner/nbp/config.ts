import axios from 'axios'
import type { AxiosInstance } from 'axios'
import type { Credential } from './index.d.js'

const BASE_URL = "TODO"
export const CREDENTIAL: Credential = _generateCredential()

//THINK: retry, and auth.
const AXIOS_INSTANCE =  axios.create({
  baseURL: BASE_URL,
  timeout: 2000,
})


export function getAxios(): AxiosInstance {
  return AXIOS_INSTANCE
} 


function _generateCredential(): Credential {
  return {
    ['USERNAME']: 'TODO',
    ['PASSWORD']: 'TODO',
    ['AGENCY_CODE']: 'TODO'
  }
}