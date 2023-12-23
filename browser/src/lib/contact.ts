import { formatSession } from '@/utils/logUtil'
import { BadRequestError, InternalError, InvalidInputError, ResourceNoFoundError } from "@/schema/error"
import { Session } from "@/types/auth"
import type { 
  ContactData, 
  ContactDeleteData,
  GetContact,
  GetContacts,
  Contact
 } from "@/types/contact"
import { LOGGER } from "@/utils/logUtil"
import { getPrismaClient } from "@/utils/prisma"
import { 
  ContactStatus, 
  ContactType
} from "@prisma/client"
import { isIBAN } from '@/utils/bankUtil'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { Many } from '@/types/http'

export async function createContact(
  session: Session,
  contactData: ContactData
): Promise<Contact> {
  const transferMethod = mapToTransferMethod(contactData.transferMethod)

  try {
    let data: any = {
      firstName: contactData.firstName,
      middleName: contactData.middleName,
      lastName: contactData.lastName,
      address1: contactData.addressLine1,
      address2: contactData.addressLine2,
      city: contactData.city,
      countryCode: contactData.countryCode,
      postCode: contactData.postalCode,
      phoneNumber: contactData.phoneNumber,
      type: transferMethod,
      ownerId: session.user!.id,
      relationshipId: contactData.relationshipId,
      currency: 'PKR',
      provinceCode: contactData.provinceCode
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
      select: ContactSelect
    })
  } catch (err: any) {
    LOGGER.error(`${formatSession(session)}`, 'method: createContact', err)
    throw new InternalError()
  }

}

export async function deleteContact(
  session: Session,
  contactId: number
): Promise<Contact> {
  try {
    return await getPrismaClient().contact.update({
      where: {
        id: contactId,
        owner: {
          id: session.user!.id
        }
      },
      data: {
        deletedAt: new Date(),
        status: ContactStatus.DELETE
      },
      select: ContactSelect
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
      select: GetContactSelect
    })
  } catch (err: any) {
    LOGGER.error(`${formatSession(session)}`, "method: getAllContactsByOwnerId", err)

    throw new InternalError()
  }
}

export async function getContactDetailByOwnerId(
  contactId: number,
  session: Session
) : Promise<Contact | null> {
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
      select: ContactSelect
    })
  } catch (err: any) {
    if ( err instanceof PrismaClientKnownRequestError && err.code === 'P2021'  ) {
      LOGGER.warn(`${formatSession(session)}`, "method: getContactDetailByOwnerId", `Contact no found with id \`${contactId}\``)
      throw new ResourceNoFoundError("Contact no Found")
    }
    LOGGER.error(`${formatSession(session)}`, "method: getContactDetailByOwnerId", err)
    throw new InternalError()
  }
}

export async function getActiveContactsByOwnerId(
  session: Session
) : Promise<Many<GetContact>> {
  try {
    const contacts = await getPrismaClient().contact.findMany({
      where: {
        OR: [
          {
            status: ContactStatus.ACTIVE
          },
          {
            status: ContactStatus.AWAIT_VERIFY
          }
        ],
        owner: {
          id: session.user!.id
        }
      },
      select: GetContactSelect
    })

    return {
      meta: {
        timestamp: new Date(),
        count: contacts.length
      },
      many: contacts
    }

  } catch (err: any) {
    LOGGER.error(`${formatSession(session)}`, "method: getActiveContactsByOwnerId", err)

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

const ContactSelect = {
  id: true,
  status: true,
  type: true,
  firstName: true,
  middleName: true,
  lastName: true,
  address1: true,
  address2: true,
  city: true,
  country: {
    select: {
      name: true,
      iso2Code: true
    }
  },
  postCode: true,
  phoneNumber: true,
  bankAccountNum: true,
  branchNum: true,
  relationship: {
    select: {
      type: true
    }
  },
  province: {
    select: {
      name: true,
      isoCode: true
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

const GetContactSelect = {
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