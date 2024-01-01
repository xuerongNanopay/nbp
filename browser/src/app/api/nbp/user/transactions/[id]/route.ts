import { fetchSession } from '@/lib/session'
import { LOGGER, formatSession } from '@/utils/logUtil'

import type {
  NextRequest
} from 'next/server'

export async function GET(
  _: Request,
  { params: {id} }: { params: { id: string } }
) {
  const session = await fetchSession()
  try {

  } catch (err: any) {
  }
}