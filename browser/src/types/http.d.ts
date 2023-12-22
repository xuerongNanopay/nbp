import { ArrayElement } from "./util"

export interface Meta {
  query?: Record<String, Any>
  timestamp: Date
}

export interface ManyMeta extends Meta {
  count: number,
  cursor?: number
}

// T extends Array<any> ? never : T
export interface Single<T> {
  meta: Meta
  single: T
}

export interface Many<S, T extends Array<S> = Array<S>> {
  meta: ManyMeta
  many: T
}

export interface HttpResponse {
  code: number,
  message: string
}

export interface HttpSUCCESS<I extends Many | Single> extends HttpResponse {
  payload: I
}

export interface HttpPUT<P> extends HttpSUCCESS<P extends Array<any> ? Many<ArrayElement<P>> : Single<P>> {}
export interface HttpDELETE<P> extends HttpSUCCESS<P extends Array<any> ? Many<ArrayElement<P>> : Single<P>> {}
export interface HttpPOST<P> extends HttpSUCCESS<P extends Array<any> ? Many<ArrayElement<P>> : Single<P>> {}
export interface HttpGET<P> extends HttpSUCCESS<P extends Array<any> ? Many<ArrayElement<P>> : Single<P>> {}

export interface HttpERROR extends HttpResponse {
  name: string
  errors?: string[]
}
