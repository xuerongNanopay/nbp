import { InternalError } from "@/schema/error"
import { Session } from "@/types/auth"
import { User } from "@/types/user"
import { LOGGER, formatSession } from "@/utils/logUtil"
import { getPrismaClient } from "@/utils/prisma"
import { UserStatus } from "@prisma/client"
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

export async function getUserDetail(
  session: Session
) : Promise<User | null> {
  try {
    return getPrismaClient().user.findUnique({
      where: {
        id: session.user!.id,
        status: {
          not: UserStatus.DELETE
        }
      },
      select: UserDetailProject
    })
  } catch (err: any) {
    if ( err instanceof PrismaClientKnownRequestError && err.code === 'P2021'  ) {
      LOGGER.warn(`${formatSession(session)}`, "method: getUserDetail", `User no found with id \`${session.user?.id}\``)
      return null
    }
    LOGGER.error(`${formatSession(session)}`, "method: getUserDetail", err)
    throw new InternalError()
  }
}

export async function closeUser(session: Session) {

}

const UserDetailProject = {
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
  }
}