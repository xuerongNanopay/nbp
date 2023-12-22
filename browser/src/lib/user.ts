import { InternalError, NBPError, ResourceNoFoundError } from "@/schema/error"
import { Session } from "@/types/auth"
import { UserDetail } from "@/types/user"
import { LOGGER, formatSession } from "@/utils/logUtil"
import { getPrismaClient } from "@/utils/prisma"
import { AccountStatus, AccountType, UserStatus } from "@prisma/client"
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { getCountryByISO2Code } from "./common"

export async function getUserDetail(
  session: Session
) : Promise<UserDetail | null> {
  try {
    const user = await getPrismaClient().user.findUnique({
      where: {
        id: session.user!.id,
        status: {
          not: UserStatus.DELETE
        }
      },
      select: UserDetailProject
    })
    if (!user) return null

    let pobPromise = getCountryByISO2Code(session, user.pob) 
    let nationalityPromise = getCountryByISO2Code(session, user.nationality)

    let rets = await Promise.all([pobPromise, nationalityPromise])
    if (!!rets[0] && !!rets[0].name) {
      user.pob = rets[0].name
    }
    if (!!rets[1] && !!rets[1].name) {
      user.nationality = rets[1].name
    }
    return user
  } catch (err: any) {
    if ( err instanceof PrismaClientKnownRequestError && err.code === 'P2021'  ) {
      LOGGER.warn(`${formatSession(session)}`, "method: getUserDetail", `User no found with id \`${session.user?.id}\``)
      throw new ResourceNoFoundError('Password not Match')
    }
    if ( err instanceof NBPError ) throw err
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
  },
  accounts: {
    where: {
      // type: AccountType.INTERACT,
      status: {
        not: AccountStatus.DELETE
      }
    },
    select: {
      email: true
    }
  }
}