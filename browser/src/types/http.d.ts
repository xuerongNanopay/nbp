import type { FetchMany, FetchUnique } from "./common"

export interface UniqueMeta {
  query: Record<String, String>
  timestamp: Date
}

export interface ManyMeta extends UniqueMeta {
  count: number,
  cursor: number?
}

// T extends Array<any> ? never : T
export interface Unique<T, F extends UniqueMeta = UniqueMeta> {
  meta: F,
  data: T
}

export interface Many<S, T extends Array<S> = Array<S>> extends Unique<T, ManyMeta> {}

export interface HttpResponse {
  code: number,
  message: number
}

export interface HttpSUCCESS<P extends Unique = Unique> {
  payload: P
}

export interface HttpPOST<I> extends HttpSUCCESS<I> {}
export interface HttpPUT<I> extends HttpSUCCESS<I> {}
export interface HttpDELETE<I> extends HttpSUCCESS<I> {}
export interface HttpGET<I> extends HttpSUCCESS<I> {}
export interface HttpGetMany<I> extends HttpSUCCESS<Many<I>> {}

export interface HttpERROR extends HttpResponse {
  name: string
  errors?: string[]
}
