import type { 
  Country,
  Region 
} from '@prisma/client'

export type GetAllCountries = Pick<Country, 'id' | 'iso2Code' | 'name'>[] | null
export type GetAllRegions = Pick<Region, 'id' | 'abbr' | 'country' | 'name'>[] | null 