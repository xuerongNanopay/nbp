import { NOTIFICATION_PAGINATION_AGE } from "@/constants/env"
import { InternalError } from "@/schema/error"
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
    return getPrismaClient().notification.create({
      data: {
        ownerId: userId,
        level,
        subject,
        content
      }
    })
  } catch (err) {
    LOGGER.error(`userId: \`${userId}\``, 'Method: notify', err)
    throw new InternalError()
  }
}

export async function markNotificationRead(userId: number, ...noticeIds: number[]) {
  try {
    return getPrismaClient().notification.updateMany({
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
  } catch (err) {
    LOGGER.error(`userId: \`${userId}\``, 'Method: markNotificationRead', err)
    throw new InternalError()
  }
}

export async function getAllNotifyByOwnerId({
  userId,
  from,
  size
}: {
  userId: number,
  from: number,
  size: number
}): Promise<GetNotifications> {
  try {
    return getPrismaClient().notification.findMany({
      where: {
        ownerId: userId,
        createdAt: {
          gte: new Date(new Date().getTime() - NOTIFICATION_PAGINATION_AGE)
        }
      },
      orderBy: {
        createdAt: 'desc'
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
  } catch (err) {
    LOGGER.error(`userId: \`${userId}\``, 'Method: getAllNotifyByOwnerId', err)
    throw new InternalError()
  }
}

export async function getNotifyDetailByOwnerId
(userId: number, notificationId: number):
Promise<GetNotification | null>{
  try {
    return getPrismaClient().notification.findUnique({
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
  } catch (err) {
    LOGGER.error(`userId: \`${userId}\``, 'Method: getNotifyDetailByOwnerId', err)
    throw new InternalError()
  }
}