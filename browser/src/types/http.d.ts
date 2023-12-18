import type { FetchMany, FetchUnique } from "./common"


export interface HttpResponse {
  code: number,
  message: number
}

export interface HttpModify<T extends FetchUnique<T>>  {
  type: 'create'
  data: T
}

export interface HttpFetchUnique<T extends FetchUnique<T>> extends HttpResponse {
  data: T
}

export interface HttpFetchMany<T extends FetchMany<T>> extends HttpResponse {
  data: T
}

export interface HttpError extends HttpResponse {
  errors: string[]
}
