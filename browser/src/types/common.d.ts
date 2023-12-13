import type { 
  Country,
  Region 
} from '@prisma/client'

export type GetCountries = Pick<Country, 'id' | 'iso2Code' | 'name'>[] | null
export type GetRegions = Pick<Region, 'id' | 'abbr' | 'country' | 'name'>[] | null 
export type GetInstitutions = Pick<Institution, 'id' | 'abbr' | 'country' | 'name'>[] | null
export type GetPersonalRelationships = Pick<PersonalRelationship, 'id' | 'type' | 'description'>[] | null
export type GetOccupations = Pick<Occupation, 'id' | 'type' | 'description'>[] | null
export type GetCurrencies = Pick<Currency, 'id' | 'isoCode' | 'decimal' | 'name'>[] | null