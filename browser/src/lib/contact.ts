import { formatSession } from '@/utils/logUtil'
import { BadRequestError, InternalError, InvalidInputError } from "@/schema/error"
import { Session } from "@/types/auth"
import type { 
  ContactData, 
  ContactDeleteData,
  GetContacts,
  UniqueContact
 } from "@/types/contact"
import { LOGGER } from "@/utils/logUtil"
import { getPrismaClient } from "@/utils/prisma"
import { 
  ContactStatus, 
  ContactType
} from "@prisma/client"
import { isIBAN } from '@/utils/bankUtil'

export async function createContact(
  session: Session,
  contactData: ContactData
): Promise<UniqueContact | null> {
  const transferMethod = mapToTransferMethod(contactData.transferMethod)

  try {
    let data: any = {
      firstName: contactData.firstName,
      middleName: contactData.middleName,
      lastName: contactData.lastName,
      address1: contactData.addressLine1,
      address2: contactData.addressLine2,
      city: contactData.city,
      country: contactData.country,
      postCode: contactData.postalCode,
      province: contactData.province,
      phoneNumber: contactData.phoneNumber,
      type: transferMethod,
      ownerId: session.user!.id,
      relationshipId: contactData.relationshipId,
      currency: 'PKR'
    }
    if (transferMethod === ContactType.BANK_ACCOUNT) {
      if (isIBAN(contactData.accountOrIban!)) {
        data = {
          ...data,
          institutionId: contactData.institutionId,
          iban: contactData.accountOrIban,
        }
      } else {
        data = {
          ...data,
          institutionId: contactData.institutionId,
          bankAccountNum: contactData.accountOrIban,
        }
      }
    }

    return await getPrismaClient().contact.create({
      data,
      select: UniqueContactSelect
    })
  } catch (err: any) {
    LOGGER.error(`${formatSession(session)}`, 'method: createContact', err)
    throw new InternalError()
  }

}

export async function deleteContact(
  session: Session,
  contactDeleteData: ContactDeleteData
): Promise<UniqueContact | null> {
  try {
    return await getPrismaClient().contact.update({
      where: {
        id: contactDeleteData.id,
        owner: session.user!.id
      },
      data: {
        deletedAt: new Date(),
        status: ContactStatus.DELETE
      },
      select: UniqueContactSelect
    })
  } catch (err: any) {
    LOGGER.error(`${formatSession(session)}`, "method: deleteContact", err)
    throw new InternalError()
  }
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
  throw new BadRequestError({name: 'Third Party Verify', message: 'Unable to verify the account with Third Party'})
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
          id: session.user!.id
        }
      },
      select: GetContactsSelect
    })
  } catch (err: any) {
    LOGGER.error(`${formatSession(session)}`, "method: getAllContactsByOwnerId", err)

    throw new InternalError()
  }
}

export async function getContactDetailByOwnerId(
  contactId: number,
  session: Session
) : Promise<UniqueContact | null> {
  try {
    return await getPrismaClient().contact.findUnique({
      where: {
        id: contactId,
        status: {
          not: ContactStatus.DELETE
        },
        owner: {
          id: session.user!.id
        }
      },
      select: UniqueContactSelect
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

const UniqueContactSelect = {
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
  relationship: {
    select: {
      type: true
    }
  },
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

const GetContactsSelect = {
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