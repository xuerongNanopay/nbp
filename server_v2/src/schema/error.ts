export class APIError<T=any> extends Error {
  httpCode: number
  data?: T | undefined
  constructor({httpCode, data}: {httpCode: number, data?: T}) {
    super()
    this.httpCode = httpCode
    this.data = data
  }
}