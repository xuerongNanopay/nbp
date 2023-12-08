import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// TODO: center auth handler.
export function middleware(request: NextRequest) {
  // console.log(request.url)
  // console.log(request.headers)
  const response = NextResponse.next()
  return response
}