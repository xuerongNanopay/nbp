import { 
  EncryptJWT, 
  jwtDecrypt,
  // SignJWT
} from "jose"
import type {
  JWTPayload
} from 'jose'
import { hkdf } from "@panva/hkdf"

const now = () => (Date.now() / 1000) | 0
const DEFAULT_MAX_AGE = 7 * 24 * 60 * 60 // default 7 days

export async function encrypt<P extends JWTPayload = JWTPayload>(params: JWTEncodeParams<P>) {
  const { token = {}, secret, maxAge = DEFAULT_MAX_AGE, salt } = params
  const encryptKey = await generateEncryptionKey(secret, salt)
  return await new EncryptJWT(token)
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setIssuedAt()
    .setExpirationTime(now() + maxAge)
    .setJti(crypto.randomUUID())
    .encrypt(encryptKey)
}

async function generateEncryptionKey(
  key: Parameters<typeof hkdf>[1],
  salt: Parameters<typeof hkdf>[2]
) {
  return await hkdf(
    "sha256",
    key,
    salt,
    `encrypt key generation`,
    32
  )
}

export async function decrypt<Payload = JWT>() {

}

export async function sign() {

}

export async function verify() {

}



interface JWTEncodeParams<Payload> {
  /**
   * @default 7 * 24 * 60 * 60 // 7 days
   */
  maxAge?: number
  salt: string
  secret: string
  token?: Payload
}

interface JWTDecodeParams {
  salt: string
  secret: string
  token?: string
}

interface JWT extends JWTPayload {
  loginId: string,
  userId?: string | null
}
