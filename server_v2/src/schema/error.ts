export class APIError<T=any, U=any> extends Error {
  httpCode: number
  request?: U | undefined
  data?: T | undefined
  constructor({httpCode, data, request}: {httpCode: number, data?: T, request?: U}) {
    super()
    this.httpCode = httpCode
    this.data = data
    this.request = request
  }
}