import axios from 'axios'
import type { AxiosInstance } from 'axios'

const BASE_URL = "TODO"
const AGENCY_CODE = '000'

//THINK: retry, and auth.
const AXIOS_INSTANCE =  axios.create({
  baseURL: BASE_URL,
  timeout: 2000,
})


export function getAxios(): AxiosInstance {
  return AXIOS_INSTANCE
} 