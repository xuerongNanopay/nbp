import { LOGGER, formatSession } from '@/utils/logUtil'
import { 
  getCurrencies
} from "@/lib/common"
import { assertSession } from "@/lib/guard"
import { fetchSession } from "@/lib/session"
import { UnauthenticateError } from "@/schema/error"

export async function GET() {
  const session = await fetchSession()

  try {
    if (!session || !assertSession(session)) throw new UnauthenticateError("Please Login")

    const currencies = await getCurrencies(session)
    return Response.json(
      {
        code: 200,
        data: currencies
      },
      {
        status: 200
      }
    )
  } catch (err: any) {
    LOGGER.error(`${formatSession(session)}`, "API: currency-GET", err)

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