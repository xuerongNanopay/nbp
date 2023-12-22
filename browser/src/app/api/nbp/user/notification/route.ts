import { fetchSession } from '@/lib/session'
import { LOGGER } from '@/utils/logUtil'

export async function GET(request: Request) {
  const session = await fetchSession()
  const { searchParams } = new URL(request.url)
  const fromStr = searchParams.get('from')
  const sizeStr = searchParams.get('size')

  try {
    let from = 0
    let size = 40
    if ( !!fromStr && !isNaN(parseInt(fromStr)) ) {
      from = parseInt(fromStr)
      if (!!sizeStr && !isNaN(parseInt(sizeStr)) && parseInt(sizeStr) <= 80)
      size = parseInt(sizeStr)
    }
  } catch (err: any) {
    LOGGER.error(`${formatSession(session)}`, "API: notification-GET", err)

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