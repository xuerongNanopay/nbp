import { LOGGER, formatSession } from '@/utils/logUtil'
import { getAllContactsByOwnerId } from "@/lib/contact";
import { assertNotDeleteUser, assertSession } from "@/lib/guard";
import { fetchSession } from "@/lib/session";
import { ForbiddenError, UnauthenticateError } from "@/schema/error";

export async function GET() {
  const session = await fetchSession()
  try {
    if (!session || !assertSession(session)) throw new UnauthenticateError("Please Login")
    if (!assertNotDeleteUser(session)) throw new ForbiddenError("Inactive User")

    const contacts = await getAllContactsByOwnerId(session)

    return Response.json(
      {
        code: 200,
        data: contacts
      },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

  } catch (err: any) {
    LOGGER.error(formatSession(session), "API: contact-GET", err)
    
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