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

export type GetCountryDetail = Prisma.CountryGetPayload<{
  select: {
    id: true,
    iso2Code: true,
    iso3Code: true,
    name: true,
    numCode: true
  }
}>

export type GetCountries = Pick<Country, 'id' | 'iso2Code' | 'name'>[]
export type GetRegions = Pick<Region, 'id' | 'abbr' | 'country' | 'isoCode' | 'name'>[] 
export type GetInstitutions = Pick<Institution, 'id' | 'abbr' | 'country' | 'name'>[]
export type GetPersonalRelationships = Pick<PersonalRelationship, 'id' | 'type' | 'description'>[]
export type GetOccupations = Pick<Occupation, 'id' | 'type' | 'description'>[]
export type GetCurrencies = Pick<Currency, 'id' | 'isoCode' | 'decimal' | 'name'>[]

export type GetAccount = Prisma.AccountGetPayload<{
  select: {
    id: true,
    status: true,
    type: true,
    isDefault: true,
    email: true
  }
}>
export type GetAccounts = GetAccount[]