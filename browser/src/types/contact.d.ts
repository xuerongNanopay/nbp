import type { Prisma } from '@prisma/client'

export interface ContactData  {
  firstName: string,
  middleName?: string,
  lastName: string,
  addressLine1: string,
  addressLine2?: string,
  city: string,
  provinceCode: string,
  countryCode: string,
  postalCode?: string,
  phoneNumber?: string,
  relationshipId: number,
  transferMethod: string,
  institutionId?: number,
  branchNo?: string,
  accountOrIban?: string
}

export interface ContactDeleteData {
  id: number
}

export type GetContactItem = Prisma.ContactGetPayload<{
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
}>
export type GetContacts = GetContactItem[]

export type UniqueContact = Prisma.ContactGetPayload<{
  select: {
    id: true,
    status: true,
    firstName: true,
    middleName: true,
    lastName: true,
    address1: true,
    address2: true,
    type: true,
    province: {
      select: {
        name: true,
        isoCode: true
      }
    },
    country: {
      select: {
        name: true,
        iso2Code: true
      }
    },
    city: true,
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
}>