import type { 
  EmailVerifyData,
  OnboardingData,
  Session, 
  SignInData,
  SignUpData,
} from '@/types/auth'
import { getPrismaClient } from '@/utils/prisma'
import {
  EmailVerifyDataValidator,
} from '@/schema/validator'
import { AccountType, IdentificationType, Login, LoginStatus, User } from '@prisma/client'
import { randSixDigits } from '@/utils/idUtil'
import { 
  asserSessionOrThrow,
  validateData
} from './guard'
import { ForbiddenError, InternalError, InvalidInputError, ResourceNoFoundError, UnauthenticateError } from '@/schema/error'

const Session_Project = {
  id: true,
  email: true,
  status: true,
  owner: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      avatarUrl: true,
      status: true,
      role: true
    }
  }
}

export async function reloadSession(
  loginId: number
) : Promise<Session | null> {
  try {
    const login = await getPrismaClient().login.findUnique({
      where: {
        id: loginId,
        status: {
          not: LoginStatus.DELETE
        }
      },
      select: Session_Project
    })
    if ( !login ) return null;

    return {
      login,
      user: login.owner
    }
    
  } catch (err: any) {
    console.error("Prisma Error: ", err)
    throw new InternalError()
  }
}

export async function reloadSessionOrThrow(
  loginId: number
) : Promise<Session> {
  const login = await getPrismaClient().login.findUnique({
    where: {
      id: loginId,
      status: {
        not: LoginStatus.DELETE
      }
    },
    select: Session_Project
  })
  if ( !login ) throw new ResourceNoFoundError(`Session No Found with id: ${loginId}`);

  return {
    login,
    user: login.owner
  }
}

export async function signIn(
  {
    email,
    password
  }: SignInData
): Promise<Session> {

  //TODO: Hash passwordata.
  const login = await getPrismaClient().login.findUnique({
    where: {
      email,
      password
    },
    select: Session_Project
  })

  if ( !login ) throw new UnauthenticateError('Email or Password no found!')

  return {
    login,
    user: login.owner
  }
}

export async function signUp(
  signUpData: SignUpData
): Promise<Session | null>  {
  
  const { email, password } = signUpData

  try {
    //TODO: hash password
    const login = await getPrismaClient().login.create({
      data: {
        email,
        password,
        verifyCode: randSixDigits()
      },
      select: {
        id: true
      }
    })

    //TODO: send email to user

    return await reloadSessionOrThrow(login.id) 
  } catch (err: any) {
    console.error("Prisma Error: ", err)
    throw new InternalError()
  }
}

export async function verifyEmail(
  session: Session,
  emailVerifyData: EmailVerifyData
): Promise<Session> {

  asserSessionOrThrow(session)
  await validateData(emailVerifyData, EmailVerifyDataValidator)

  const s = await reloadSession(session.login.id)

  if (!s) throw new UnauthenticateError("Please Login!")

  if (s.login.status !== LoginStatus.AWAIT_VERIFY) {
    return s
  }

  if (s.login.verifyCode !== emailVerifyData.code) {
    throw new ForbiddenError("Invalid Code")
  }

  // Active Login
  try {
    const ns = await getPrismaClient().login.update({
      where: {
        id: s.login.id
      },
      data: {
        status: LoginStatus.ACTIVE,
        verifyCodeAt: new Date()
      },
      select: Session_Project
    })
    return await reloadSessionOrThrow(ns.id) 
  } catch (err: any) {
    console.error("Prisma Error: ", err)
    throw new InternalError()
  }
}

export async function refreshVerifyCode(
  session: Session,
) {
  try {
    const login = await getPrismaClient().login.update({
      where: {
        id: session.login.id
      },
      data: {
        verifyCode: randSixDigits()
      }
    })
  } catch(err: any ) {
    console.error("Prisma Error: ", err)
    throw new InternalError()
  }
}

export async function onboarding(
  session: Session,
  data: OnboardingData
): Promise<User | null> {

  const idType = mapToIdentificationType(data.identityType)
  try {
    return await getPrismaClient().user.create({
      data: {
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        address1: data.address1,
        address2: data.address2,
        city: data.city,
        province: data.province,
        country: data.country,
        postalCode: data.postalCode,
        phoneNumber: data.phoneNumber,
        dob: data.dob,
        pob: data.pob,
        nationality: data.nationality,
        occupationId: data.occupationId,
        identification: {
          create: {
            type: idType,
            value: data.identityNumber,
          }
        },
        accounts: {
          create: {
            type: AccountType.INTERACT,
            email: data.interacEmail,
            isDefault: true
          }
        },
        logins: {
          connect: {
            id: session.login.id
          }
        }
      }
    })
  } catch (err: any) {
    console.error("session", session, "Prisma Error: ", err)
    throw new InternalError()
  }
}

function mapToIdentificationType(identityType: string) {
  switch(identityType) {
    case IdentificationType.DRIVER_LICENSE:
      return IdentificationType.DRIVER_LICENSE
    case IdentificationType.NATIONAL_ID:
      return IdentificationType.NATIONAL_ID
    case IdentificationType.PASSWORD:
      return IdentificationType.PASSWORD
    case IdentificationType.PROVINCAL_ID:
      return IdentificationType.PROVINCAL_ID
    default:
      throw new InvalidInputError("Onboarding Error", ["Invalid Identification Type"])
  }
}