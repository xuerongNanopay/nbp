import { CookieSessionStore } from '@/utils/cookieUtil'
import { cookies as nextCookies } from 'next/headers'
import { JWTExpired } from "jose/errors"
import type { Session } from '@/types/auth'
import { JWT_SECRET, SESSION_AGE } from '@/constants/env'

if ( ! JWT_SECRET ) {
  console.error("JWT_SECRET does not provide")
  process.exit(1)
}

const cookieSessionStore = new CookieSessionStore<Session>({
  jwtParams: {
    maxAge: SESSION_AGE,
    // maxAge: 0,
    secret: JWT_SECRET
  },
  cookieParams: {
    name: 'NANO_ID',
    options: {
      maxAge: SESSION_AGE,
    }
  }
})

//If the session is expire or valid, then return null
export async function fetchSession(): ReturnType<typeof cookieSessionStore.loadSession> {
  const cookieData = nextCookies().getAll()
  try {
    let sessionPayload = await cookieSessionStore.loadSession(cookieData)
    if ( sessionPayload == null ) return null

    return sessionPayload
  } catch ( err ) {
    if ( !(err instanceof JWTExpired) ) {
      console.error("Session parse error: ", err)
    }
    return null
  }
}
export async function AAAA() {}
export async function fetchSessionFromRawCookies(cookies: Record<string, string>): ReturnType<typeof cookieSessionStore.loadSession> {
  const cookieData: {name: string, value: string}[] = []
  for (const key in cookies) {
    cookieData.push({name: key, value: cookies[key]})
  }
  try {
    let sessionPayload = await cookieSessionStore.loadSession(cookieData)
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