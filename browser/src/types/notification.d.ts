import type { Prisma } from '@prisma/client'

export type GetNotification = Prisma.NotificationGetPayload<{
  select: {
    id: true,
    status: true,
    subject: true,
    content: true,
    level: true,
    createdAt: true
  }
}>

export type GetNotifications = GetNotification[]