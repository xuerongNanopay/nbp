import { getPrismaClient } from '@/utils/prisma'
import { Country, Currency, Institution, Occupation, PersonalRelationship, Region } from '@prisma/client';

export async function getRegionsByCountryCode(
  countryCode: string
): Promise<Pick<Region, 'id' | 'abbr' | 'country' | 'name'> | null> {
  return null
}

export async function getCountries()
: Promise<Pick<Country, 'id' | 'iso2Code' | 'name'> | null>{
  return null
}

export async function getInstitutionsByCountryCode(
  countryCode: string
) : Promise<Pick<Institution, 'id' | 'abbr' | 'country' | 'name'> | null>
{
  return null
}

export async function getPersinoalRelationships()
: Promise<Pick<PersonalRelationship, 'id' | 'type' | 'description'> | null> {
  return null
}

export async function getOccupations()
: Promise<Pick<Occupation, 'id' | 'type' | 'description'> | null> {
  return null
}

export async function getCurrencies()
: Promise<Pick<Currency, 'id' | 'isoCode' | 'decimal' | 'name'> | null> {
  return  null
}