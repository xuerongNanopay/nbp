import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next"
import type { CookieSerializeOptions } from 'cookie'
import { JWT } from './jwtUtil'

const MAX_COOKIE_SIZE = 4096
const PRESERVED_SIZE = 256
const CHUNK_SIZE = MAX_COOKIE_SIZE - PRESERVED_SIZE

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

  constructor(option: CookieOption) {
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
        value: value.substring(i * CHUNK_SIZE, CHUNK_SIZE)
      }
      ret.push(c)
    }

    console.warn({
      message: `Session cookie exceeds allowed ${CHUNK_SIZE} bytes.`,
      valueSize: value.length
    })

    return ret
  }
}

export interface SessionStore<S> {
  loadSession(req: NextApiRequest):Promise<S>,
  applySession(res: NextApiResponse, s: S): void 
}

// Manage cookie
// Get from request and apply to response.
// Handle encryption and decryption.
export class JWTSessionStore<S extends JWT = JWT> implements SessionStore<S> {
  
  async loadSession(req: NextApiRequest): Promise<S> {
    const s = {loginId: 1} as S
    return s;
  }

  applySession(res: NextApiResponse, s: S) {

  } 
}