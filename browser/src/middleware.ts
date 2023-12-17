import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// TODO: IF cookie is about to expire and user still active then delay expiration for 1 hours.
export async function middleware(request: NextRequest) {
  // console.log(request.url)
  // console.log(request.headers)
  // const url = new URL(request.url)
  // console.log(url)
  // if (url.pathname.startsWith(""))
  const response = NextResponse.next()
  // return response
}