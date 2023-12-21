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
  GetCurrencies,
  GetCountryDetail
} from '@/types/common'
import { LOGGER, formatSession } from '@/utils/logUtil';
import { InternalError } from '@/schema/error';
import { Session } from '@/types/auth';

export async function getRegionsByCountryCode(
  session: Session,
  countryCode: string
): Promise<GetRegions | null> {
  try {
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
  } catch (err: any) {
    LOGGER.error(`${formatSession(session)}`, "method: getRegionsByCountryCode", err)

    throw new InternalError()
  }
}

export async function getCountries(
  session: Session
)
: Promise<GetCountries | null>{
  try {
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
  } catch (err: any) {
    LOGGER.error(`${formatSession(session)}`, "method: getCountries", err)

    throw new InternalError()
  }
}

export async function getCountryByISO2Code(
  session: Session,
  isoCode: string,
) : Promise<GetCountryDetail | null>  {
  try {
    return await getPrismaClient().country.findUnique({
      where: {
        status: CountryStatus.ACTIVE,
        iso2Code: isoCode
      },
      select: {
        id: true,
        iso2Code: true,
        iso3Code: true,
        name: true,
        numCode: true
      }
    })
  } catch (err: any) {
    LOGGER.error(`${formatSession(session)}`, "method: getCountryByISO2Code", err)
    throw new InternalError()
  }
}  

export async function getInstitutionsByCountryCode(
  session: Session,
  countryCode: string
) : Promise<GetInstitutions | null>
{
  try {
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
  } catch (err: any) {
    LOGGER.error(`${formatSession(session)}`, "method: getInstitutionsByCountryCode", err)

    throw new InternalError()
  }
}

export async function getPersinoalRelationships(
  session: Session
)
: Promise<GetPersonalRelationships | null> {
  try {
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
  } catch (err: any) {
    LOGGER.error(`${formatSession(session)}`, "method: getPersinoalRelationships", err)

    throw new InternalError()
  }
}

export async function getOccupations(
  session: Session
)
: Promise<GetOccupations | null> {
  try {
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
  } catch (err: any) {
    LOGGER.error(`${formatSession(session)}`, "method: getOccupations", err)

    throw new InternalError()
  }
}

export async function getCurrencies(
  session: Session
)
: Promise<GetCurrencies | null> {
  try {
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
  } catch (err: any) {
    LOGGER.error(`${formatSession(session)}`, "method: getCurrencies", err)

    throw new InternalError()
  }
}