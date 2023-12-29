import { LOGGER, formatSession } from '@/utils/logUtil'
import { assertNotDeleteUser, assertSession } from "@/lib/guard";
import { fetchSession } from "@/lib/session";
import { ForbiddenError, UnauthenticateError } from "@/schema/error";
import { getAllAcountsByOwnerId } from '@/lib/account';

export async function GET() {
  const session = await fetchSession()
  try {
    if (!session || !assertSession(session)) throw new UnauthenticateError("Please Login")
    if (!assertNotDeleteUser(session)) throw new ForbiddenError("Inactive User")

    const accounts = await getAllAcountsByOwnerId(session)

    return Response.json(
      {
        code: 200,
        message: 'Fetch Success',
        payload: accounts
      },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

  } catch (err: any) {
    LOGGER.error(formatSession(session), "API: accounts-GET", err)
    
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