import { assertSession } from '@/lib/guard'
import { getManyNotifyByOwnerId, notifyInfo } from '@/lib/notification'
import { fetchSession } from '@/lib/session'
import { UnauthenticateError } from '@/schema/error'
import { HttpERROR, HttpGET } from '@/types/http'
import { GetNotifications } from '@/types/notification'
import { randSixDigits } from '@/utils/idUtil'
import { LOGGER, formatSession } from '@/utils/logUtil'

export async function GET(request: Request) {
  const session = await fetchSession()
  const { searchParams } = new URL(request.url)
  const fromStr = searchParams.get('from')
  const sizeStr = searchParams.get('size')

  // for (let _ in Array(100).fill(0)) {
  //   notifyInfo(session!.user!.id, randSixDigits(), randSixDigits())
  // }

  try {
    if (!session || !assertSession(session)) throw new UnauthenticateError("Please Login")

    // assign default value.
    let from = 0
    let size = 40
    if ( !!fromStr && !isNaN(parseInt(fromStr)) ) {
      from = parseInt(fromStr)
      if (!!sizeStr && !isNaN(parseInt(sizeStr)) && parseInt(sizeStr) <= 80)
      size = parseInt(sizeStr)
    }

    const manyNotifications = await getManyNotifyByOwnerId({userId: session.user!.id, from, size})

    const result :HttpGET<GetNotifications> = {
      code: 200,
      message: 'Success',
      payload: manyNotifications
    }

    return Response.json(
      result,
      {
        status: 200
      }
    )
  } catch (err: any) {
    LOGGER.error(`${formatSession(session)}`, "API: notification-GET", err)

    const errorResponse: HttpERROR = !err.errors ? {
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