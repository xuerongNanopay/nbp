import { 
  assertActiveUser, 
  assertSession, 
  castAndValidateData
} from '@/lib/guard'
import { fetchSession } from '@/lib/session'
import { getTransactionsByOwnerId } from '@/lib/transaction'
import { UnauthenticateError } from '@/schema/error'
import { GetTransactionOptionValidator } from '@/schema/validator'
import { GetTransactionOption } from '@/types/transaction'
import { LOGGER, formatSession } from '@/utils/logUtil'

import type {
  NextRequest
} from 'next/server'

export async function POST(req: NextRequest) {
  const session = await fetchSession()

  try {
    if (!session || !assertSession(session)) throw new UnauthenticateError("Please Login")

    const getTransactionOptionPayload = await req.json()
    console.log("aaaa: ", getTransactionOptionPayload)
    const getTransactionOption = await castAndValidateData(getTransactionOptionPayload, GetTransactionOptionValidator) as GetTransactionOption

    const transactions = await getTransactionsByOwnerId(session, getTransactionOption)

    return Response.json(transactions, {
      status: 201,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch(err: any) {
    LOGGER.error(formatSession(session), "API: transactions-POST", err)

    const errorResponse = !err.errors ? {
      code: err.code,
      name: err.name,
      message: err.message
    } : {
      code: err.code,
      name: err.name,
      message: err.message,
      errors: err.errors
    }
    return Response.json(errorResponse, {
      status: err.code ?? 500,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}