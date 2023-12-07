import { 
  EncryptJWT, 
  jwtDecrypt,
  // SignJWT
} from "jose"
import type {
  JWTPayload
} from 'jose'
import { hkdf } from "@panva/hkdf"
import * as crypto from 'crypto'

const now = () => (Date.now() / 1000) | 0
const DEFAULT_MAX_AGE = 7 * 24 * 60 * 60 // default 7 days

export async function encryptJWT<P extends JWTPayload = JWT>(params: JWTEncryptParams<P>) {
  const { token = {}, secret, maxAge = DEFAULT_MAX_AGE, salt } = params
  const key = await generateCryptoKey(secret, salt)
  return await new EncryptJWT(token)
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setIssuedAt()
    .setExpirationTime(now() + maxAge)
    .setJti(crypto.randomUUID())
    .encrypt(key)
}

async function generateCryptoKey(
  secret: Parameters<typeof hkdf>[1],
  salt: Parameters<typeof hkdf>[2]
) {
  return await hkdf(
    "sha256",
    secret,
    salt,
    `encrypt key generation`,
    32
  )
}

export async function decryptJWT<P extends JWTPayload = JWT>(
  params: JWTDecodeParams
) : Promise<P | null>  {
  const { token, secret, salt } = params
  if ( !token ) return null;
  const key = await generateCryptoKey(secret, salt)
  const { payload } = await jwtDecrypt(token, key, {
    clockTolerance: 15,
  })
  return payload as P
}

export async function sign() {
  
}

export async function verify() {

}



export interface JWTEncryptParams<Payload> {
  /**
   * @default 7 * 24 * 60 * 60 // 7 days
   */
  maxAge?: number
  salt: string
  secret: string
  token?: Payload
}

export interface JWTDecodeParams {
  salt: string
  secret: string
  token?: string
}

export interface JWT extends JWTPayload {
  loginId: number
}
