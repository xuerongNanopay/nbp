import { encryptJWT, decryptJWT } from "@/utils/jwtUtil"
import type { JWT, JWTEncryptParams } from "@/utils/jwtUtil"

test('JWT encryption and decryption', async () => {
  const secret = 'My Secret'
  const salt = 'My Salt'
  const payload: JWT = {
    loginId: 111,
    userId: 222
  }

  const enParams: JWTEncryptParams<JWT> = {
    maxAge: 60 * 60, // 1 hour,
    secret,
    salt,
    token: payload
  }

  const encryptString = await encryptJWT<JWT>(enParams)

  const msg = await decryptJWT({
    secret,
    salt,
    token: encryptString
  })

  expect(msg).not.toBeNull();
  expect(msg?.loginId).toEqual(payload.loginId)
  expect(msg?.userId).toEqual(payload.userId)
})