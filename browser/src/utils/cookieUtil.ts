import { encryptJWT, decryptJWT } from "./jwtUtil"
import { JWTExpired } from "jose/errors"

import type { CookieSerializeOptions } from 'cookie'
import { JWT } from './jwtUtil'

export const MAX_COOKIE_SIZE = 4096
export const PRESERVED_SIZE = 256
export const CHUNK_SIZE = MAX_COOKIE_SIZE - PRESERVED_SIZE

export interface CookieOption {
  name: string
  options?: CookieSerializeOptions
}

export interface Cookie extends CookieOption {
  value: string
}

// Cookie Map from http heandler
export type RawCookies = Record<string, string>

// Seperate a cookie string into multiple chunkera against CHUNK_SIZE.
// compose cookie string from multiple chunkers
export class CookieChunker {
  #option: CookieOption
  #logger: Console | undefined

  constructor(option: Pick<CookieOption, 'name' | 'options'>) {
    this.#option = option
  }

  compose(cookies: RawCookies): Pick<Cookie, 'name' | 'value'> {
    const c: RawCookies = {}
    const cookieNamePrefix = this.#option.name
    for (const [name, value] of Object.entries(cookies)) {
      if (!name.startsWith(cookieNamePrefix) || !value) continue
      c[name] = value
    }
    const sortedKeys = Object.keys(c).sort((a, b) => {
      const aSuffix = parseInt(a.split(".").pop() || "0")
      const bSuffix = parseInt(b.split(".").pop() || "0")

      return aSuffix - bSuffix
    })

    const value = sortedKeys.map((key) => c[key]).join("")
    return {
      name: cookieNamePrefix,
      value
    }
  }

  chunker(value: Cookie['value'], opt?: CookieOption): Cookie[] {
    const chunkCount = Math.ceil(value.length / CHUNK_SIZE)
    const opts = opt ?? this.#option
    if ( chunkCount === 1 ) {
      return [
        {
          ...opts,
          value
        }
      ]
    }

    const ret: Cookie[] = []
    const { name: cookieNamePrefix } = opts
    for (let i = 0 ; i < chunkCount ; i++ ) {
      const c = {
        ...opts,
        name: `${cookieNamePrefix}.${i}`,
        value: value.substring(i * CHUNK_SIZE, (i+1) * CHUNK_SIZE)
      }
      ret.push(c)
    }

    if ( !!this.#logger ) {
      this.#logger.warn({
        message: `Session cookie exceeds allowed ${CHUNK_SIZE} bytes.`,
        valueSize: value.length
      })
    }

    return ret
  }
}

// export interface SessionStore<S> {
//   loadSession(req: any):Promise<S|null>,
//   applySession(res: any, s: S): void 
// }

const defaultCookieChunker = new CookieChunker({name: '__session'})


export type CookieSessionStoreParam = {
  jwtParams: {
    secret: string,
    maxAge?: number
  },
  cookieParams: CookieOption
}
// Manage cookie
// Get from request and apply to response.
// Handle encryption and decryption.
// export class CookieSessionStore<S extends JWT = JWT> implements SessionStore<S> {
export class CookieSessionStore<S extends JWT = JWT>{

  #params
  #cookieChunker
  #jwtParams

  constructor(params: CookieSessionStoreParam) {
    this.#params = params
    this.#cookieChunker = new CookieChunker(params.cookieParams)
    this.#jwtParams = {...params.jwtParams}
  }
  
  async loadSession(allCookies: {name: string, value: string}[]): Promise<S|null> {
    // const cookies = parse(req.headers['cookie'] ?? "")
    if ( ! allCookies || allCookies.length == 0 ) return null

    const cookies = allCookies.reduce<RawCookies>((arr, c)=> {arr[c.name]=c.value; return arr}, {})
    const cookie = this.#cookieChunker.compose(cookies)
    if ( cookie.value.trim() === "" ) return null

    const payload = await decryptJWT<S>({
      secret: this.#jwtParams.secret,
      //TODO: store salt in another cookie.
      salt: '5;Vv0_N4H:c',
      token: cookie.value
    })
    return payload;
  }

  async applySession(nextCookies: any, s: S, maxAge?: number) {
    const encryptedPayload = await encryptJWT<S>({
      maxAge: maxAge ?? this.#jwtParams.maxAge, // default 7 days
      secret: this.#jwtParams.secret,
      //TODO: store salt in another cookie.
      salt: '5;Vv0_N4H:c',
      token: s
    })
    const cookies = this.#cookieChunker.chunker(encryptedPayload)
    for (const c of cookies) {
      nextCookies().set(c.name, c.value, {...c.options, maxAge: maxAge ?? c.options?.maxAge})
    }
  }

  async cleanSession(nextCookies: any) {
    nextCookies().getAll().forEach((c:any) => {
      if ( c.name.startsWith(this.#params.cookieParams.name) ) {
        nextCookies().delete(c.name)
      }
    })
  }
}