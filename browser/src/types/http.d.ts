import type { FetchMany, FetchUnique } from "./common"
import { ArrayElement } from "./util"

export interface UniqueMeta {
  query: Record<String, Any>
  timestamp: Date
}

export interface ManyMeta extends UniqueMeta {
  count: number,
  cursor?: number
}

// T extends Array<any> ? never : T
export interface Unique<T, F extends UniqueMeta = UniqueMeta> {
  meta: F,
  data: T
}

export interface Many<S, T extends Array<S> = Array<S>> extends Unique<T, ManyMeta> {}

export interface HttpResponse {
  code: number,
  message: string
}

export interface HttpSUCCESS<P extends Unique = Unique> extends HttpResponse {
  payload: P
}

export interface HttpPOST<I> extends HttpSUCCESS<I> {}
export interface HttpPUT<I> extends HttpSUCCESS<I> {}
export interface HttpDELETE<I> extends HttpSUCCESS<I> {}
export interface HttpGET<I> extends HttpSUCCESS<I extends Array<any> ? Many<ArrayElement<I>> : Unique<I>> {}

export interface HttpERROR extends HttpResponse {
  name: string
  errors?: string[]
}
