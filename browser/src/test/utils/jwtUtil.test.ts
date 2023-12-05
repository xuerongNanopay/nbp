import { encryptJWT } from "@/utils/jwtUtil"
import type { JWT, JWTEncryptParams } from "@/utils/jwtUtil"

test('JWT encryption and decryption', async () => {
  const payload: JWT = {
    loginId: 111,
    userId: 222
  }

  const enParams: JWTEncryptParams<JWT> = {
    maxAge: 60 * 60, // 1 hour,
    secret: "My Secret",
    salt: "My Salt",
    token: payload
  }

  const encryptString = await encryptJWT<JWT>(enParams)

  console.log(encryptString)
})