import { 
  assertActiveUser, 
  assertSession, 
  castAndValidateData
} from '@/lib/guard'
import { fetchSession } from '@/lib/session'
import { UnauthenticateError } from '@/schema/error'
import { GetTransactionOption } from '@/types/transaction'
import { LOGGER, formatSession } from '@/utils/logUtil'

import type {
  NextRequest
} from 'next/server'

export async function POST(req: NextRequest) {
  const session = await fetchSession()

  try {
    if (!session || !assertSession(session)) throw new UnauthenticateError("Please Login")

    const getTransactionOption: GetTransactionOption
  } catch(err: any) {

  }
}