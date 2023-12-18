import { InternalError } from "@/schema/error"
import { GetAccounts } from "@/types/common"
import { getPrismaClient } from "@/utils/prisma"
import { 
  AccountStatus, 
} from "@prisma/client"

export async function getAllAcountsByOwnerId(
  ownerId: number
): Promise<GetAccounts | null> {
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
    console.error('owerId', ownerId,'getAllAcountsByOwnerId', err)
    throw new InternalError()
  }
}