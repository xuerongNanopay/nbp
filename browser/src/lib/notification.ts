import { NOTIFICATION_PAGINATION_AGE_SEC } from "@/constants/env"
import { InternalError, ResourceNoFoundError } from "@/schema/error"
import { Many, Single } from "@/types/http"
import { GetNotification, GetNotifications } from "@/types/notification"
import { LOGGER } from "@/utils/logUtil"
import { getPrismaClient } from "@/utils/prisma"
import { Notification, NotificationLevel, NotificationStatus } from "@prisma/client"

export async function notifyInfo(userId: number, subject: string, content: string) {
  await notify({
    userId,
    subject,
    content,
    level: NotificationLevel.INFO
  })
}

export async function notifyError(userId: number, subject: string, content: string) {
  await notify({
    userId,
    subject,
    content,
    level: NotificationLevel.ERROR
  })
}

export async function notifyWarm(userId: number, subject: string, content: string) {
  await notify({
    userId,
    subject,
    content,
    level: NotificationLevel.WARM
  })
}

export async function notify({
  userId,
  level,
  subject,
  content
}: {
  userId: number,
  level: NotificationLevel,
  subject: string,
  content: string
}) : Promise<Notification> {
  try {
    const notification =  await getPrismaClient().notification.create({
      data: {
        ownerId: userId,
        level,
        subject,
        content
      }
    })
    LOGGER.debug(`userId: \`${userId}\``, 'Method: notify', `create notification: \`${notification.id}\``)
    return notification
  } catch (err) {
    LOGGER.error(`userId: \`${userId}\``, 'Method: notify', err)
    throw new InternalError()
  }
}

export async function markNotificationRead(
  userId: number, 
  ...noticeIds: number[]
) : Promise<Many<number>> {
  try {
    const batch = await getPrismaClient().notification.updateMany({
      where: {
        ownerId: userId,
        status: {
          not: NotificationStatus.READ
        },
        id: {
          in: noticeIds
        }
      },
      data: {
        status: NotificationStatus.READ,
        readAt: new Date()
      }
    })
    LOGGER.info(`userId: \`${userId}\``, 'Method: markNotificationRead', `total update: \`${batch.count}\``, `ids: \`${noticeIds}\``)
    return {
      meta: {
        count: batch.count,
        timestamp: new Date()
      },
      many: noticeIds
    }
  } catch (err) {
    LOGGER.error(`userId: \`${userId}\``, 'Method: markNotificationRead', err)
    throw new InternalError()
  }
}

export async function getManyNotifyByOwnerId({
  userId,
  from,
  size
}: {
  userId: number,
  from: number,
  size: number
}): Promise<Many<GetNotification>> {
  try {
    const where = {
      ownerId: userId,
      createdAt: {
        gte: new Date(new Date().getTime() - NOTIFICATION_PAGINATION_AGE_SEC * 1000)
      }
    }
    const notifications = getPrismaClient().notification.findMany({
      where,
      orderBy: {
        // createdAt: 'desc'
        id: 'desc'
      },
      skip: from,
      take: size,
      select: {
        id: true,
        status: true,
        subject: true,
        content: true,
        level: true,
        createdAt: true
      }
    })
    const count = getPrismaClient().notification.count({
      where
    })

    const rets = await Promise.all([count, notifications])

    return {
      meta: {
        query: {
          from,
          size,
          orderBy: {
            // createdAt: 'desc'
            id: 'desc'
          }
        },
        timestamp: new Date(),
        count: rets[0],
      },
      many: rets[1]
    }
  } catch (err) {
    LOGGER.error(`userId: \`${userId}\``, 'Method: getAllNotifyByOwnerId', err)
    throw new InternalError()
  }
}

export async function getNotifyDetailByOwnerId
(userId: number, 
  notificationId: number
) : Promise<Single<GetNotification>>{
  try {
    const nodification = await getPrismaClient().notification.findUnique({
      where: {
        ownerId: userId,
        id: notificationId
      },
      select: {
        id: true,
        status: true,
        subject: true,
        content: true,
        level: true,
        createdAt: true
      }
    })
    if ( !nodification ) throw new ResourceNoFoundError("notification no found")

    return {
      meta: {
        query: {
          id: notificationId,
        },
        timestamp: new Date()
      },
      single: nodification
    }
  } catch (err) {
    LOGGER.error(`userId: \`${userId}\``, 'Method: getNotifyDetailByOwnerId', err)
    throw new InternalError()
  }
}