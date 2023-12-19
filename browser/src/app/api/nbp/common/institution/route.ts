import { LOGGER, formatSession } from '@/utils/logUtil'
import { getInstitutionsByCountryCode } from "@/lib/common"
import { assertSession } from "@/lib/guard"
import { fetchSession } from "@/lib/session"
import { UnauthenticateError } from "@/schema/error"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const countryCode = searchParams.get('countryCode') as string
  const session = await fetchSession()

  try {
    if (!session || !assertSession(session)) throw new UnauthenticateError("Please Login")

    const institutions = !countryCode ? [] : await getInstitutionsByCountryCode(session, countryCode)
    return Response.json(
      {
        code: 200,
        data: institutions
      },
      {
        status: 200
      }
    )
  } catch (err: any) {
    LOGGER.error(`${formatSession(session)}`, "API: institution-GET", err)

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