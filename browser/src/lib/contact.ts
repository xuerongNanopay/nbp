import { formatSession } from '@/utils/logUtil'
import { BadRequestError, InternalError, InvalidInputError } from "@/schema/error"
import { Session } from "@/types/auth"
import { GetContacts, GetUniqueContact } from "@/types/common"
import { ContactData, ContactDeleteData } from "@/types/contact"
import { LOGGER } from "@/utils/logUtil"
import { getPrismaClient } from "@/utils/prisma"
import { 
  ContactStatus, 
  Contact,
  ContactType
} from "@prisma/client"

export async function createContact(
  session: Session,
  contactData: ContactData
): Promise<Pick<Contact, 'id'> | null> {
  const transferMethod = mapToTransferMethod(contactData.transferMethod)

  try {
    return null
  } catch (err: any) {
    LOGGER.error(`${formatSession(session)}`, 'method: createContact', )
    console.error("session", session, "onboarding: ", err)
    throw new InternalError()
  }

}

export async function deleteContact(
  session: Session,
  contactDeleteData: ContactDeleteData
): Promise<Contact | null> {
  return null
}

//Using third party API to verify contact
//Throw error if any error occurs.
export async function preVerifyContact(
  session: Session,
  contactData: ContactData
) {
  console.log("TODO: using third Party to varify account")

  if ( contactData.transferMethod !== ContactType.BANK_ACCOUNT ) return
  
  //TODO: call API...
  throw new BadRequestError({name: 'Third Party Fail', message: 'Unable to verify the account with Third Party'})
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
    LOGGER.error(`${formatSession(session)}`, "method: getAllContactsByOwnerId", err)

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
    LOGGER.error(`${formatSession(session)}`, "method: getContactDetailByOwnerId", err)
    throw new InternalError()
  }
}

function mapToTransferMethod(transferMethod: string) {
  switch(transferMethod) {
    case ContactType.BANK_ACCOUNT:
      return ContactType.BANK_ACCOUNT
    case ContactType.CASH_PICKUP:
      return ContactType.CASH_PICKUP
    default:
      throw new InvalidInputError("Contact Creationg error", [`Invalid transferMethod: ${transferMethod}`])
  }
}