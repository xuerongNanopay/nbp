import { deleteContact, getContactDetailByOwnerId } from "@/lib/contact"
import { assertActiveUser } from "@/lib/guard"
import { fetchSession } from "@/lib/session"
import { InvalidInputError, ResourceNoFoundError, UnauthenticateError } from "@/schema/error"
import { LOGGER, formatSession } from "@/utils/logUtil"
import { NextRequest } from "next/server"

export async function GET(
  _: Request,
  { params: {id} }: { params: { id: string } }
) {
  const session = await fetchSession()
  try {
    if (!session || !assertActiveUser(session)) throw new UnauthenticateError("Inactive User")

    const contactId = parseInt(id)
    if ( isNaN(contactId) ) throw new InvalidInputError("Invalid Contact Id")

    const contact = await getContactDetailByOwnerId(contactId, session)
    if (!contact) throw new ResourceNoFoundError("Contact No Found")

    return Response.json(
      {
        code: 200,
        data: contact
      },
      {
        status: 200
      }
    )

  } catch (err: any) {
    LOGGER.error(formatSession(session), `contact/${id}-GET: `, err.toString())
    
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

export async function DELETE(
  _: NextRequest,
  { params: {id} }: { params: { id: string } }
) {
  console.log('delete ' + id)
  const session = await fetchSession()

  try {
    if (!session || !assertActiveUser(session)) throw new UnauthenticateError("Inactive User")
    const contactId = parseInt(id)
    if ( isNaN(contactId) ) throw new InvalidInputError("Invalid Contact Id")

    let contact = await getContactDetailByOwnerId(contactId, session)
    if (!contact) throw new ResourceNoFoundError("Contact No Found")

    contact = await deleteContact(session, contactId)
    return Response.json(
      {
        code: 200,
        message: 'Success delete',
        data: contact
      },
      {
        status: 200
      }
    )
  } catch(err: any) {
    LOGGER.error(formatSession(session), `API: contact/${id}-DELETE`, err)
    
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