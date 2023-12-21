import type { Prisma } from '@prisma/client'

export type User = Prisma.UserGetPayload<{
  select: {
    id: true,
    status: true,
    firstName: true,
    middleName: true,
    lastName: true,
    address1: true,
    address2: true,
    city: true,
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
    postCode: true,
    dob: true,
    phoneNumber: true,
    pob: true,
    nationality: true,
    identification: {
      select: {
        type: true,
        value: true
      }
    },

    occupation: {
      select: {
        type: true
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