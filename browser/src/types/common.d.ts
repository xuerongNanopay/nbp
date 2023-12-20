import type { 
  Country,
  Prisma,
  Region 
} from '@prisma/client'

export interface FetchMeta {
  queries: Record<String, String>
  date: Date
}

export interface FetchManyMeta extends FetchMeta {
  totalCount: number,
  fetchCount: number,
  cursor: number?
}

export interface FetchUnique<T> {
  meta: FetchMeta,
  data: T
}

export interface FetchMany<T> {
  meta: FetchManyMeta,
  data: T
}

export type GetCountries = Pick<Country, 'id' | 'iso2Code' | 'name'>[]
export type GetRegions = Pick<Region, 'id' | 'abbr' | 'country' | 'isoCode' | 'name'>[] 
export type GetInstitutions = Pick<Institution, 'id' | 'abbr' | 'country' | 'name'>[]
export type GetPersonalRelationships = Pick<PersonalRelationship, 'id' | 'type' | 'description'>[]
export type GetOccupations = Pick<Occupation, 'id' | 'type' | 'description'>[]
export type GetCurrencies = Pick<Currency, 'id' | 'isoCode' | 'decimal' | 'name'>[]

export type GetAccounts = Prisma.AccountGetPayload<{
  select: {
    id: true,
    status: true,
    type: true,
    isDefault: true,
    email: true
  }
}>[]

export type GetContacts = Prisma.ContactGetPayload<{
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
}>[]

export type GetUniqueContact = Prisma.ContactGetPayload<{
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