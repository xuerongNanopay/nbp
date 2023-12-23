
export interface EditInteracData {
  newEmail: string
}
export type GetAccount = Prisma.AccountGetPayload<{
  select: {
    id: true,
    status: true,
    type: true,
    isDefault: true,
    email: true
  }
}>
export type GetAccounts = GetAccount[]

export type GetInteracAccount = Prisma.AccountGetPayload<{
  select: {
    id: true,
    status: true,
    type: true,
    isDefault: true,
    email: true
  }
}>
export type GetInteracAccounts = GetInteracAccount[]