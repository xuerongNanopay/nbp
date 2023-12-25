import { createContact } from '@/lib/contact'
import { assertActiveUser, assertSession, castAndValidateData } from '@/lib/guard'
import { fetchSession } from '@/lib/session'
import { ForbiddenError, UnauthenticateError } from '@/schema/error'
import { ContactDataValidator } from '@/schema/validator'
import { ContactData } from '@/types/contact'
import { LOGGER, formatSession } from '@/utils/logUtil'
import type {
  NextRequest
} from 'next/server'

export async function POST(req: NextRequest) {
  const session = await fetchSession()

  try {
    if (!session || !assertSession(session)) throw new UnauthenticateError("Please Login")
    if (!assertActiveUser(session)) throw new ForbiddenError("Inactive User")

    const contactPayload = await req.json()
    const contactData = await castAndValidateData(contactPayload, ContactDataValidator) as ContactData

    const newContact = await createContact(session, contactData)
    return Response.json({
      code: 201,
      message: 'Create Successfully',
      data: newContact
    }, {
      status: 201,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch(err: any) {
    LOGGER.error(formatSession(session), "API: contacts/create-POST", err)
    
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