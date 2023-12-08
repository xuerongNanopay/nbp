import { CookieSessionStore, SessionPayload } from '@/utils/cookieUtil'
import { JWT } from '@/utils/jwtUtil'
import { cookies as nextCookies } from 'next/headers'

const now = () => (Date.now() / 1000) | 0

const JWT_SECRET = process.env['JWT_SECRET']
if ( ! JWT_SECRET ) process.exit(1)

const cookieSessionStore = new CookieSessionStore<JWT>({
  jwtParams: {
    maxAge: 1 * 60,
    secret: JWT_SECRET
  },
  cookieParams: {
    name: 'CCCCC',
    options: {
      // maxAge: 7 * 24 * 60 * 60,
    }
  }
})

//If the session is expire or valid, then return null
export async function fetchSession(): ReturnType<typeof cookieSessionStore.loadSession> {
  // const { cookies } = require("next/headers")
  const sessionPayload = await cookieSessionStore.loadSession(nextCookies().getAll())
  if ( sessionPayload == null ) return null

  if ( ! sessionPayload.exp || sessionPayload.exp < now() ) {
    // console.log("session expire", sessionPayload.exp)
    return null
  }

  //TODO: check is token valid
  return sessionPayload
}

// Using in signIn
export async function setSession(payload: Awaited<ReturnType<typeof cookieSessionStore.loadSession>> ) {
  if ( ! payload ) {
    //TODO: log
    return
  }
  // const { cookies } = require("next/headers")
  await cookieSessionStore.applySession(nextCookies, payload)
}

// Using in signOut
export async function cleanSession() {
  const payload = await fetchSession()
  if (!payload) return
  await cookieSessionStore.applySession(nextCookies, payload, -1)
}