import { createContact, preVerifyContact } from '@/lib/contact'
import { assertActiveUser, castAndValidateData } from '@/lib/guard'
import { fetchSession } from '@/lib/session'
import { UnauthenticateError } from '@/schema/error'
import { ContactDataValidator } from '@/schema/validator'
import { ContactData } from '@/types/contact'
import { LOGGER, formatSession } from '@/utils/logUtil'
import type {
  NextRequest
} from 'next/server'

export async function POST(req: NextRequest) {
  const session = await fetchSession()

  try {
    if (!session || !assertActiveUser(session)) throw new UnauthenticateError("Inactive User")

    const contactPayload = await req.json()
    const contactData = await castAndValidateData(contactPayload, ContactDataValidator) as ContactData

    const newContact = await preVerifyContact(session, contactData)
    return Response.json({
      code: 200,
      message: 'Create Successfully',
      data: newContact
    }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch(err: any) {
    LOGGER.error(formatSession(session), "API: contact/create-GET", err)
    
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