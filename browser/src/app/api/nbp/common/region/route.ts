import { formatSession } from "@/constants/log"
import { getRegionsByCountryCode } from "@/lib/common"
import { assertSession } from "@/lib/guard"
import { fetchSession } from "@/lib/session"
import { UnauthenticateError } from "@/schema/error"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const countryCode = searchParams.get('countryCode') as string
  const session = await fetchSession()

  try {
    if (!assertSession(session)) throw new UnauthenticateError("Please Login")

    const regions = !countryCode ? [] : await getRegionsByCountryCode(countryCode)
    return Response.json(
      {
        code: 200,
        data: regions
      },
      {
        status: 200
      }
    )
  } catch (err: any) {
    console.error(formatSession(session), "region-GET: ", err.toString())

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