import { updateInteracAccountEmail } from '@/lib/account'
import { assertActiveUser, assertSession, castAndValidateData } from '@/lib/guard'
import { fetchSession } from '@/lib/session'
import { ForbiddenError, UnauthenticateError } from '@/schema/error'
import { EditInteracDataValidator } from '@/schema/validator'
import { EditInteracData } from '@/types/account'
import { LOGGER, formatSession } from '@/utils/logUtil'
import type {
  NextRequest
} from 'next/server'

export async function POST(req: NextRequest) {
  const session = await fetchSession()

  try {
    if (!session || !assertSession(session)) throw new UnauthenticateError("Please Login")
    if (!assertActiveUser(session)) throw new ForbiddenError("Inactive User")

    const editInteracPayload = await req.json()
    const editInteracData = await castAndValidateData(editInteracPayload, EditInteracDataValidator) as EditInteracData

    const _ = await updateInteracAccountEmail(session, editInteracData)
    return Response.json({
      code: 201,
      message: 'Interac Email Updated'
    }, {
      status: 201,
      headers: {
        'Content-Type': 'application/json'
      }
    })

  } catch (err: any) {
    LOGGER.error(formatSession(session), "API: profile/edit_password-POST", err)
    
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