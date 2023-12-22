import { assertSession } from '@/lib/guard'
import { getManyNotifyByOwnerId, getNotifyDetailByOwnerId } from '@/lib/notification'
import { fetchSession } from '@/lib/session'
import { InvalidInputError, UnauthenticateError } from '@/schema/error'
import { HttpERROR, HttpGET } from '@/types/http'
import { GetNotification, GetNotifications } from '@/types/notification'
import { LOGGER, formatSession } from '@/utils/logUtil'

export async function GET(_: Request, { params: {id} }: { params: { id: string } }) {
  const session = await fetchSession()

  try {
    if (!session || !assertSession(session)) throw new UnauthenticateError("Please Login")
    const notificationId = parseInt(id)
    if (isNaN(notificationId)) throw new InvalidInputError(`id should be a number \`${id}\``)

    const manyNotifications = await getNotifyDetailByOwnerId(session.user!.id, notificationId)

    const result :HttpGET<GetNotification> = {
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