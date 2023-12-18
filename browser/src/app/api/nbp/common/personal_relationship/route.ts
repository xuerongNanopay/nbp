import { formatSession } from "@/constants/log"
import { 
  getPersinoalRelationships
} from "@/lib/common"
import { assertSession } from "@/lib/guard"
import { fetchSession } from "@/lib/session"
import { UnauthenticateError } from "@/schema/error"

export async function GET() {
  const session = await fetchSession()

  try {
    if (!assertSession(session)) throw new UnauthenticateError("Please Login")

    const relstionships = await getPersinoalRelationships()
    return Response.json(
      {
        code: 200,
        data: relstionships
      },
      {
        status: 200
      }
    )
  } catch (err: any) {
    console.error(formatSession(session), "personal_relationship-GET: ", err.toString())

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