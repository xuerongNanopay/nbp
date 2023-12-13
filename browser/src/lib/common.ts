import { getPrismaClient } from '@/utils/prisma'
import { Country, CountryStatus, Currency, CurrencyStatus, Institution, InstitutionStatus, Occupation, OccupationStatus, PersonalRelationship, PersonalRelationshipStatus, Region, RegionStatus } from '@prisma/client';

export async function getRegionsByCountryCode(
  countryCode: string
): Promise<Pick<Region, 'id' | 'abbr' | 'country' | 'name'>[] | null > {
  return await getPrismaClient().region.findMany({
    where: {
      country: countryCode ?? '',
      status: RegionStatus.ACTIVE
    },
    select: {
      id: true,
      abbr: true,
      country: true,
      name: true
    }
  })
}

export async function getCountries()
: Promise<Pick<Country, 'id' | 'iso2Code' | 'name'>[] | null>{
  return await getPrismaClient().country.findMany({
    where: {
      status: CountryStatus.ACTIVE
    },
    select: {
      id: true,
      iso2Code: true,
      name: true
    }
  })
}

export async function getInstitutionsByCountryCode(
  countryCode: string
) : Promise<Pick<Institution, 'id' | 'abbr' | 'country' | 'name'>[] | null>
{
  return await getPrismaClient().institution.findMany({
    where: {
      country: countryCode ?? '',
      status: InstitutionStatus.ACTIVE
    },
    select: {
      id: true,
      abbr: true,
      country: true,
      name: true
    }
  })
}

export async function getPersinoalRelationships()
: Promise<Pick<PersonalRelationship, 'id' | 'type' | 'description'>[] | null> {
  return await getPrismaClient().personalRelationship.findMany({
    where: {
      status: PersonalRelationshipStatus.ACTIVE
    },
    select: {
      id: true,
      type: true,
      description: true
    }
  })
}

export async function getOccupations()
: Promise<Pick<Occupation, 'id' | 'type' | 'description'>[] | null> {
  return await getPrismaClient().occupation.findMany({
    where: {
      status: OccupationStatus.ACTIVE
    },
    select: {
      id: true,
      type: true,
      description: true
    }
  })
}

export async function getCurrencies()
: Promise<Pick<Currency, 'id' | 'isoCode' | 'decimal' | 'name'>[] | null> {
  return  await getPrismaClient().currency.findMany({
    where: {
      status: CurrencyStatus.ACTIVE
    },
    select: {
      id: true,
      isoCode: true,
      decimal: true,
      name: true
    }
  })
}