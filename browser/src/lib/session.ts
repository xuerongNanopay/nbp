import { CookieSessionStore } from '@/utils/cookieUtil'
import { cookies as nextCookies } from 'next/headers'
import { DEFAULT_SESSION_AGE } from '@/utils/cookieUtil'
import { JWTExpired } from "jose/errors"
import type { Session } from '@/types/auth'

const JWT_SECRET = process.env['JWT_SECRET']
if ( ! JWT_SECRET ) process.exit(1)

const cookieSessionStore = new CookieSessionStore<Session>({
  jwtParams: {
    maxAge: DEFAULT_SESSION_AGE,
    // maxAge: 0,
    secret: JWT_SECRET
  },
  cookieParams: {
    name: 'NANO_ID',
    options: {
      maxAge: DEFAULT_SESSION_AGE,
    }
  }
})

//If the session is expire or valid, then return null
export async function fetchSession(): ReturnType<typeof cookieSessionStore.loadSession> {
  try {
    let sessionPayload = await cookieSessionStore.loadSession(nextCookies().getAll())
    if ( sessionPayload == null ) return null

    return sessionPayload
  } catch ( err ) {
    if ( !(err instanceof JWTExpired) ) {
      console.error("Session parse error: ", err)
    }
    return null
  }
}

// Using in signIn
export async function setSession(payload: Awaited<ReturnType<typeof cookieSessionStore.loadSession>> ) {
  if ( ! payload ) {
    //TODO: log
    return
  }

  await cookieSessionStore.cleanSession(nextCookies)
  await cookieSessionStore.applySession(nextCookies, payload)
}

// Using in signOut
export async function cleanSession() {
  await cookieSessionStore.cleanSession(nextCookies)

  const payload = await fetchSession()
  if (!!payload) {
    await cookieSessionStore.applySession(nextCookies, payload, -1)
  }
}