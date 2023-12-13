import { getPrismaClient } from "@/utils/prisma"
import { 
  ContactStatus, 
  Prisma,
  Contact
} from "@prisma/client"

export async function postContact(
  
): Promise<Pick<Contact, 'id'> | null> {
  return null
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

export async function getContactDetailByOwnerId(
  contactId: number,
  ownerId: number
) : Promise<Prisma.ContactGetPayload<{
  select: {
    id: true,
    status: true,
    firstName: true,
    middleName: true,
    lastName: true,
    address1: true,
    address2: true,
    province: true,
    country: true,
    postCode: true,
    phoneNumber: true,
    bankAccountNum: true,
    branchNum: true,
    relationshipToOwner: true,
    iban: true,
    createdAt: true,
    owner: {
      select: {
        id: true,
      }
    },
    institution: { 
      select: {
        name: true,
        institutionNum: true,
        country: true,
        abbr: true
      }
    }
  }
}>[] | null> {
  try {
    return await getPrismaClient().contact.findMany({
      where: {
        id: contactId,
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
        middleName: true,
        lastName: true,
        address1: true,
        address2: true,
        province: true,
        country: true,
        postCode: true,
        phoneNumber: true,
        bankAccountNum: true,
        branchNum: true,
        relationshipToOwner: true,
        iban: true,
        createdAt: true,
        owner: {
          select: {
            id: true
          }
        },
        institution: {
          select: {
            name: true,
            institutionNum: true,
            country: true,
            abbr: true
          }
        }
      }
    })
  } catch (err: any) {
    throw new PrismaError(err.code, err.message)
  }
}
