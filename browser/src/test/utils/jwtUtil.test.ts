import { encryptJWT, decryptJWT } from "@/utils/jwtUtil"
import type { JWT, JWTEncryptParams } from "@/utils/jwtUtil"
import { JWEDecryptionFailed } from 'jose/errors'

describe('JWT encryption and decryption', () => {

  test('with no malice ', async () => {
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
  });

  test('with malicious encrypted payload', async () => {
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

    try {
      const msg = await decryptJWT({
        secret,
        salt,
        token: encryptString + 'Bad Guy change the payload'
      })
      expect("Here").toBe("not reach")
    } catch ( err ) {
      expect(err).toBeInstanceOf(JWEDecryptionFailed)
      expect((err as JWEDecryptionFailed).code).toBe('ERR_JWE_DECRYPTION_FAILED')
    }
  });

  test('with malicious secret', async () => {
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

    try {
      const msg = await decryptJWT({
        secret: secret + "bad secret",
        salt,
        token: encryptString + 'Bad Guy change the payload'
      })
      expect("Here").toBe("not reach")
    } catch ( err ) {
      expect(err).toBeInstanceOf(JWEDecryptionFailed)
      expect((err as JWEDecryptionFailed).code).toBe('ERR_JWE_DECRYPTION_FAILED')
    }
  });

  test('with malicious salt', async () => {
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

    try {
      const msg = await decryptJWT({
        secret,
        salt: salt + "bad sale",
        token: encryptString + 'Bad Guy change the payload'
      })
      expect("Here").toBe("not reach")
    } catch ( err ) {
      expect(err).toBeInstanceOf(JWEDecryptionFailed)
      expect((err as JWEDecryptionFailed).code).toBe('ERR_JWE_DECRYPTION_FAILED')
    }
  });
});