import { InternalError } from "@/schema/error"
import { Session } from "@/types/auth"
import { GetAccounts } from "@/types/common"
import { LOGGER, formatSession } from "@/utils/logUtil"
import { getPrismaClient } from "@/utils/prisma"
import { 
  AccountStatus, 
} from "@prisma/client"

export async function getAllAcountsByOwnerId(
  session: Session
): Promise<GetAccounts | null> {
  try {
    return await getPrismaClient().account.findMany({
      where: {
        status: {
          not: AccountStatus.DELETE
        },
        owner: {
          id: session.user?.id
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
    LOGGER.error(`${formatSession(session)}`, 'Method: getAllAcountsByOwnerId', err)
    throw new InternalError()
  }
}