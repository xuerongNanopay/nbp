import { formatSession } from "@/constants/log"
import { InternalError } from "@/schema/error"
import { Session } from "@/types/auth"
import { GetContacts, GetUniqueContact } from "@/types/common"
import { getPrismaClient } from "@/utils/prisma"
import { 
  ContactStatus, 
  Contact
} from "@prisma/client"

export async function createContact(
  session: Session
): Promise<Pick<Contact, 'id'> | null> {
  
  return null
}

export async function getAllContactsByOwnerId(
  session: Session
): Promise<GetContacts | null> {
  try {
    return await getPrismaClient().contact.findMany({
      where: {
        status: {
          not: ContactStatus.DELETE
        },
        owner: {
          id: session.user?.id
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
    console.error(formatSession(session), 'getAllContactsByOwnerId: ', err)
    throw new InternalError()
  }
}

export async function getContactDetailByOwnerId(
  contactId: number,
  session: Session
) : Promise<GetUniqueContact | null> {
  try {
    return await getPrismaClient().contact.findUnique({
      where: {
        id: contactId,
        status: {
          not: ContactStatus.DELETE
        },
        owner: {
          id: session.user?.id
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
    console.error(formatSession(session), 'contactId: ', contactId,'getAllContactsByOwnerId: ', err)
    throw new InternalError()
  }
}
