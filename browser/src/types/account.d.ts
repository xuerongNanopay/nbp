
import type { Prisma } from '@prisma/client'

export interface EditInteracData {
  newEmail: string
}
export type GetAccount = Prisma.AccountGetPayload<{
  select: {
    id: true,
    status: true,
    type: true,
    email: true
  }
}>
export type GetAccounts = GetAccount[]