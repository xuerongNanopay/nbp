// import { authOptions } from "./app/api/auth/[...nextauth]/options"
// import { withAuth } from "next-auth/middleware"

// // Need to apply the override pages.
// export default withAuth({pages: authOptions.pages})

// export const config = { matcher: ["/private/(.*)"] }

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Do nothing
export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  return response
}