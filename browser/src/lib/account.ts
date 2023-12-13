import { getPrismaClient } from "@/utils/prisma"
import { 
  AccountStatus, 
  Prisma, 
} from "@prisma/client"

export async function getAllAcountsByOwnerId(
  ownerId: number
): Promise<Prisma.AccountGetPayload<{
  select: {
    id: true,
    status: true,
    type: true,
    isDefault: true,
    email: true
  }
}>[] | null> {
  try {
    return await getPrismaClient().account.findMany({
      where: {
        status: {
          not: AccountStatus.DELETE
        },
        owner: {
          id: ownerId
        }
      },
      select: {
        id: true,
        status: true,
        type: true,
        isDefault: true,
        email: true
      }
    })
  } catch (err: any) {
    throw new PrismaError(err.code, err.message)
  }
}