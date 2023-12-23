import { assertSession, castAndValidateData } from "@/lib/guard";
import { markNotificationRead } from "@/lib/notification";
import { fetchSession } from "@/lib/session";
import { UnauthenticateError } from "@/schema/error";
import { NotificationReadMarkDataValidator } from "@/schema/validator";
import type { HttpERROR, HttpGET } from "@/types/http";
import { NotificationReadMarkData } from "@/types/notification";
import { LOGGER, formatSession } from "@/utils/logUtil";

import type {
  NextRequest
} from 'next/server'

export async function POST(req: NextRequest) {
  const session = await fetchSession()

  
  try {
    if (!session || !assertSession(session)) throw new UnauthenticateError("Please Login")

    const notificationPayload = await req.json()
    const notifications = await castAndValidateData(notificationPayload, NotificationReadMarkDataValidator) as NotificationReadMarkData

    const count = await markNotificationRead(session.user!.id, ...notifications.ids)

    const result :HttpGET<number[]> = {
      code: 200,
      message: 'Success',
      payload: count
    }

    return Response.json(
      result,
      {
        status: 200
      }
    )
  } catch (err: any) {
    LOGGER.error(`${formatSession(session)}`, "API: notification/mark_read-POST", err)

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