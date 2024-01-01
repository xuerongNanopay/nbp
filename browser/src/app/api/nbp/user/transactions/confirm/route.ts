import { 
  assertActiveUser, 
  assertSession, 
  castAndValidateData
} from '@/lib/guard'
import { fetchSession } from '@/lib/session'
import { LOGGER, formatSession } from '@/utils/logUtil'
import { 
  ForbiddenError, 
  UnauthenticateError 
} from '@/schema/error'
import type {
  NextRequest
} from 'next/server'
import { TransactionConfirmDataValidator } from '@/schema/validator'
import type { TransactionConfirmData, TransactionConfirmResult, TransactionQuoteResult } from '@/types/transaction'
import { confirmTransaction } from '@/lib/transaction'
import { HttpPOST } from '@/types/http'

export async function POST(req: NextRequest) {
  const session = await fetchSession()

  try {
    if (!session || !assertSession(session)) throw new UnauthenticateError("Please Login")
    if (!assertActiveUser(session)) throw new ForbiddenError("Inactive User")

    const quotePayload = await req.json()
    const quoteData = await castAndValidateData(quotePayload, TransactionConfirmDataValidator) as TransactionConfirmData

    const transaction = await confirmTransaction(session, quoteData)
    const responsePayload: HttpPOST<TransactionConfirmResult> = {
      code: 201,
      message: 'Quote successfully.',
      payload: {
        meta: {
          timestamp: new Date()
        },
        single: transaction
      }
    }
    return Response.json(responsePayload, {
      status: 201,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch(err: any) {
    LOGGER.error(formatSession(session), "API: transactions/confirm-POST", err)

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