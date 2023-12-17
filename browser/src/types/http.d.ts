export interface FetchMeta {
  queries: Record<String, String>
  date: Date
}

export interface FetchManyMeta extends FetchMeta {
  totalCount: number,
  fetchCount: number
}

export interface FetchUnique<T> {
  meta: FetchMeta,
  data: T
}

export interface FetchMany<T> {
  meta: FetchManyMeta,
  data: T
}

export interface HttpResponse {
  code: number,
  message: number
}

export interface HttpModify<T extends FetchUnique<T>>  {
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
