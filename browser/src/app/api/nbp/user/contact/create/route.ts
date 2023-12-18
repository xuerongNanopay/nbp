import type {
  NextRequest
} from 'next/server'

export async function POST(req: NextRequest) {

  const contactPayload = await req.json()
}