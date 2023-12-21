import type { Prisma } from '@prisma/client'

export type UserDetail = Prisma.UserGetPayload<{
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
    postalCode: true,
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
    accounts: {
      select: {
        email: true
      }
    }
  }
}>