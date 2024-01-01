import { 
  assertActiveUser, 
  assertSession, 
  castAndValidateData
} from '@/lib/guard'
import { fetchSession } from '@/lib/session'
import { LOGGER, formatSession } from '@/utils/logUtil'

import type {
  NextRequest
} from 'next/server'

export async function POST(req: NextRequest) {

}