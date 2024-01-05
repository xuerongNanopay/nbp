import axios from 'axios'
import type { AxiosInstance } from 'axios'

//THINK: retry, and auth.
const AXIOS_INSTANCE =  axios.create({
  baseURL: 'https://some-domain.com/api/',
  timeout: 1000,
  headers: {'X-Custom-Header': 'foobar'}
})


export function getAxios(): AxiosInstance {
  return AXIOS_INSTANCE
} 