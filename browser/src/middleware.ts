import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import cookie from 'cookie'
import { fetchSessionFromRawCookies } from './lib/session'

// TODO: IF cookie is about to expire and user still active then delay expiration for 1 hours.
export async function middleware(request: NextRequest) {
  // console.log(request.url)
  const allCookies = cookie.parse(request.headers.get('cookie') ?? '')
  console.log(await fetchSessionFromRawCookies(allCookies))
  
  // const url = new URL(request.url)
  // console.log(url)
  // if (url.pathname.startsWith(""))
  const response = NextResponse.next()
  // return response
}

export const config = {
  matcher: [
    '/nbp/about/:path*',
    '/nbp/contacts/:path*',
    '/nbp/dashboard/:path*',
    '/nbp/notifications/:path*',
    '/nbp/profile/:path*',
    '/nbp/transfer/:path*',
    '/nbp/transactions/:path*',
  ]
}