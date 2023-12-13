import { getPrismaClient } from "@/utils/prisma"
import { 
  Account, 
  AccountStatus, 
  Contact,
  ContactStatus, 
  Prisma, 
  UserStatus 
} from "@prisma/client"

export async function getAllAcountsByOwnerId(
  ownerId: number
): Promise<Pick<Account, 'id' | 'status' | 'type' | 'isDefault' | 'email'>[] | null> {
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

export async function getAllContactsByOwnerId(
  ownerId: number
): Promise<Prisma.ContactGetPayload<{
  select: {
    id: true,
    status: true,
    firstName: true,
    lastName: true,
    type: true,
    bankAccountNum: true,
    iban: true,
    institution: { select: {abbr: true}}
  }
}>[] | null> {
  try {
    return await getPrismaClient().contact.findMany({
      where: {
        status: {
          not: ContactStatus.DELETE
        },
        owner: {
          id: ownerId
        }
      },
      select: {
        id: true,
        status: true,
        firstName: true,
        lastName: true,
        type: true,
        bankAccountNum: true,
        iban: true,
        institution: {
          select: {
            abbr: true
          }
        }
      }
    })
  } catch (err: any) {
    throw new PrismaError(err.code, err.message)
  }
}