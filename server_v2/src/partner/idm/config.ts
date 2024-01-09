import axios from 'axios'
import type { AxiosInstance } from 'axios'
import type { Credential } from './index.d.js'

const BASE_URL = "TODO"
export const CREDENTIAL: Credential = _generateCredential()

const AXIOS_INSTANCE =  axios.create({
  baseURL: BASE_URL,
  timeout: 2000,
})

export function getAxios(): AxiosInstance {
  return AXIOS_INSTANCE
}

function _generateCredential(): Credential {
  return {
    ['API_USER']: 'TODO',
    ['API_KEY']: 'TODO'
  }
}