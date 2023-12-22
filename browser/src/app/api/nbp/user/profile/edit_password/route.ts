import { editPassword } from '@/lib/auth'
import { assertNotDeleteUser, castAndValidateData } from '@/lib/guard'
import { fetchSession } from '@/lib/session'
import { UnauthenticateError } from '@/schema/error'
import { EditPasswordDataValidator } from '@/schema/validator'
import { EditPasswordData } from '@/types/auth'
import { LOGGER, formatSession } from '@/utils/logUtil'
import type {
  NextRequest
} from 'next/server'

export async function POST(req: NextRequest) {
  const session = await fetchSession()

  try {
    if (!session || !assertNotDeleteUser(session)) throw new UnauthenticateError("Inactive User")

    const editPasswordPayload = await req.json()
    const editPasswordData = await castAndValidateData(editPasswordPayload, EditPasswordDataValidator) as EditPasswordData

    const _ = await editPassword(session, editPasswordData)
    return Response.json({
      code: 201,
      message: 'New Password Created'
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