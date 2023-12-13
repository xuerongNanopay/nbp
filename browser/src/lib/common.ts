import { getPrismaClient } from '@/utils/prisma'
import { 
  CountryStatus, 
  CurrencyStatus, 
  InstitutionStatus, 
  OccupationStatus, 
  PersonalRelationshipStatus, 
  RegionStatus 
} from '@prisma/client';
import type { 
  GetCountries,
  GetRegions,
  GetInstitutions,
  GetPersonalRelationships,
  GetOccupations,
  GetCurrencies
} from '@/types/common'

export async function getRegionsByCountryCode(
  countryCode: string
): Promise<GetRegions | null> {
  return await getPrismaClient().region.findMany({
    where: {
      country: countryCode ?? '',
      status: RegionStatus.ACTIVE
    },
    select: {
      id: true,
      abbr: true,
      country: true,
      name: true,
      isoCode: true
    }
  })
}

export async function getCountries()
: Promise<GetCountries | null>{
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
) : Promise<GetInstitutions | null>
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
: Promise<GetPersonalRelationships | null> {
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
: Promise<GetOccupations | null> {
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
: Promise<GetCurrencies | null> {
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