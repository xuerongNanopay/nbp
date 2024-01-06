import axios from 'axios'
import type { AxiosInstance } from 'axios'
import { getBaseUrl } from './config.js'

//THINK: retry, and auth.
const AXIOS_INSTANCE =  axios.create({
  baseURL: getBaseUrl(),
  timeout: 2000,
})


export function getAxios(): AxiosInstance {
  return AXIOS_INSTANCE
} 