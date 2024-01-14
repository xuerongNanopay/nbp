export class APIError<T=any, U=any> extends Error {
  httpCode: number
  request?: U | undefined
  response?: T | undefined
  constructor({httpCode, response, request}: {httpCode: number, response?: T, request?: U}) {
    super()
    this.httpCode = httpCode
    this.response = response
    this.request = request
  }
}