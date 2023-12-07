import { serialize, parse } from "cookie"
import type {
  NextApiRequest,
  NextApiResponse,
} from "next"
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
    if (!option.options) {
      //TODO: fill default.
      this.#option = {...option, options: {}}
    }
    this.#option = option
  }

  compose(cookies: RawCookies): Pick<Cookie, 'name' | 'value'> {
    const c: RawCookies = {}
    const { name: cookieNamePrefix } = this.#option
    for (const [name, value] of Object.entries(cookies)) {
      if (!name.startsWith(cookieNamePrefix) || !value) continue
      c[name] = value
    }

    const sortedKeys = Object.keys(cookies).sort((a, b) => {
      const aSuffix = parseInt(a.split(".").pop() || "0")
      const bSuffix = parseInt(b.split(".").pop() || "0")

      return aSuffix - bSuffix
    })

    const value = sortedKeys.map((key) => cookies[key]).join("")

    return {
      name: cookieNamePrefix,
      value
    }
  }

  chunker(value: Cookie['value']): Cookie[] {
    const chunkCount = Math.ceil(value.length / CHUNK_SIZE)

    if ( chunkCount === 1 ) {
      return [
        {
          ...this.#option,
          value
        }
      ]
    }

    const ret: Cookie[] = []
    const { name: cookieNamePrefix } = this.#option
    for (let i = 0 ; i < chunkCount ; i++ ) {
      const c = {
        ...this.#option,
        name: `cookieNamePrefix.${i}`,
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

export interface SessionStore<S> {
  loadSession(req: NextApiRequest):Promise<S>,
  applySession(res: NextApiResponse, s: S): void 
}

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
export class CookieSessionStore<S extends JWT = JWT> implements SessionStore<S> {

  #cookieChunker
  #jwtParams

  constructor(params: CookieSessionStoreParam) {
    this.#cookieChunker = new CookieChunker({name: params.cookieParams.name})
    this.#jwtParams = {...params.jwtParams}
  }
  
  async loadSession(req: NextApiRequest): Promise<S> {
    const cookies = parse(req.headers['cookie'] ?? "")

    const s = {loginId: 1} as S
    return s;
  }

  applySession(res: NextApiResponse, s: S) {

  } 
}

export interface SessionPayload extends JWT {
  loginId: number,
  userId: number,
  username: string,
  loginStatus: string,
  thumbnail: string,
  userStatus: string,
  isVerifyEmail: boolean,
  isOnboarding: boolean,
  role: string[]
}