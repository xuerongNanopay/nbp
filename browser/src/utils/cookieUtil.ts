import type { CookieSerializeOptions } from 'cookie'

const MAX_COOKIE_SIZE = 4096
const PRESERVED_SIZE = 256
const CHUNK_SIZE = MAX_COOKIE_SIZE - PRESERVED_SIZE

const DEFAULT_COOKIE_OPTION: CookieSerializeOptions = {
  
}

export interface CookieOption {
  name: string
  options: CookieSerializeOptions
}

export interface Cookie extends CookieOption {
  value: string
}

// Seperate a string into multiple chunker against CHUNK_SIZE.
export class CookieChunker {
  #option: CookieOption

  constructor(option: CookieOption) {
    this.#option = option
  }
}

// Manage cookie.
// Get from request and apply to response.
export class CookieStore {

}