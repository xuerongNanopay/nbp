import type { 
  Country,
  Prisma,
  Region 
} from '@prisma/client'

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