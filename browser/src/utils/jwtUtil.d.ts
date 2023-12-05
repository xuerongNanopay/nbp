export interface JWTEncodeParams<Payload> {
  /**
   * @default 7 * 24 * 60 * 60 // 7 days
   */
  maxAge?: number
  salt: string
  secret: string
  token?: Payload
}

export interface DefaultJWT extends Record<string, unknown> {
  loginId: string,
  userId?: string | null
}

export interface JWT extends Record<string, unknown>, DefaultJWT {}
