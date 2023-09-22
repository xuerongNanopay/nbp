import { NextRequest, NextResponse } from "next/server"
import { limiter } from "../config/limiter"

export async function GET(request: Request) {

  const remaining = await limiter.removeTokens(1)
  console.log(remaining)
  if ( remaining < 0 ) return new NextResponse(null, {
    status: 429,
    statusText: "Too Many Requests",
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  })
  return new Response('Hello, Next.js!')
}
