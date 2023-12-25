import { InternalError } from "@/schema/error"
import { Session } from "@/types/auth"
import { GetAccount, EditInteracData} from "@/types/account"
import { LOGGER, formatSession } from "@/utils/logUtil"
import { getPrismaClient } from "@/utils/prisma"
import { 
  AccountStatus, AccountType, 
} from "@prisma/client"
import { Many } from "@/types/http"

export async function getAllAcountsByOwnerId(
  session: Session
): Promise<Many<GetAccount>> {
  try {
    const accounts = await getPrismaClient().account.findMany({
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
    return {
      meta: {
        count: accounts.length,
        timestamp: new Date()
      },
      many: accounts
    }
  } catch (err: any) {
    LOGGER.error(`${formatSession(session)}`, 'Method: getAllAcountsByOwnerId', err)
    throw new InternalError()
  }
}

export async function getActiveInteracAccountsById(
  session: Session
): Promise<Many<GetAccount>> {
  try {
    const accounts = await getPrismaClient().account.findMany({
      where: {
        type: AccountType.INTERACT,
        status: {
          not: AccountStatus.DELETE
        },
        owner: {
          id: session.user!.id
        }
      },
      select: {
        id: true,
        status: true,
        
        type: true,
        email: true
      }
    })

    return {
      meta: {
        count: accounts.length,
        timestamp: new Date()
      },
      many: accounts
    }
  } catch (err: any) {
    LOGGER.error(`${formatSession(session)}`, 'Method: getActiveInteracAccountsById', err)
    throw new InternalError()
  }
}

export async function updateInteracAccountEmail(
  session: Session,
  editInteracData: EditInteracData
): Promise<GetAccount> {
  try {
    return await getPrismaClient().$transaction(async (tx) => {
      const accounts = await getPrismaClient().account.findMany({
        where: {
          status: {
            not: AccountStatus.DELETE
          },
          type: AccountType.INTERACT,
          ownerId: session.user!.id
        }
      })
      if ( accounts.length === 0 ) {
        LOGGER.warn(`${formatSession(session)}`, 'Method: updateInteracAccountEmail', 'Do not have a valid interac account')
      } else if ( accounts.length > 1 ) {
        LOGGER.warn(`${formatSession(session)}`, 'Method: updateInteracAccountEmail', 'Has more than one valid interac account')
      }
  
      await getPrismaClient().account.updateMany({
        where: {
          status: {
            not: AccountStatus.DELETE
          },
          type: AccountType.INTERACT,
          ownerId: session.user!.id
        },
        data: {
          status: AccountStatus.DELETE,
          deletedAt: new Date()
        }
      })
  
      LOGGER.info(`${formatSession(session)}`, 'Method: updateInteracAccountEmail', `Delete interac account: \`${accounts.map(a => a.id).join(',')}\``)
  
      const newInteracAccount = await getPrismaClient().account.create({
        data: {
          type: AccountType.INTERACT,
          status: AccountStatus.ACTIVE,
          email: editInteracData.newEmail,
          currency: 'CAD',
          ownerId: session.user!.id
        },
        select: {
          id: true,
          status: true,
          type: true,
          isDefault: true,
          email: true
        }
      })
      LOGGER.info(`${formatSession(session)}`, 'Method: updateInteracAccountEmail', `create new interac account: \`${newInteracAccount.id}\``)
      return newInteracAccount
    })
  } catch (err: any) {
    LOGGER.error(`${formatSession(session)}`, 'Method: updateInteracAccountEmail', err)
    throw new InternalError()
  }
}