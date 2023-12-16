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
import { 
  InternalError, 
  InvalidInputError, 
  NBPError, 
  ResourceNoFoundError, 
  UnauthenticateError 
} from '@/schema/error'

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
      login: {...login},
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
): Promise<Pick<Login, 'id'> | null>  {
  
  const { email, password } = signUpData

  try {
    const existlogin = await getPrismaClient().login.findUnique({
      where: {
        email: signUpData.email
        //Check for delete?
      },
      select: {
        id: true
      }
    })
    if (!!existlogin) throw new InvalidInputError('Email is already being used')

    //TODO: hash password
    return await getPrismaClient().login.create({
      data: {
        email,
        password,
        verifyCode: randSixDigits()
      },
      select: {
        id: true
      }
    })

  } catch (err: any) {
    if ( err instanceof NBPError ) throw err

    console.error("Prisma Error: ", err)
    throw new InternalError()
  }
}

export async function verifyEmail(
  session: Session,
  emailVerifyData: EmailVerifyData
): Promise<Login | null> {

  try {
    const login = await getPrismaClient().login.update({
      where: {
        id: session.login.id,
        verifyCode: emailVerifyData.code
      },
      data: {
        status: LoginStatus.ACTIVE,
        verifyCodeAt: new Date()
      },
    })
    return login
  } catch (err: any) {
    if ( err.code === 'P2025' ) {
      throw new InvalidInputError('Invalid Code')
    } else {
      console.error("Prisma Error: ", err)
      throw new InternalError()
    }
  }
}

export async function refreshVerifyCode(
  session: Session,
): Promise<Pick<Login, 'id' | 'email' | 'verifyCode'> | undefined> {
  try {
    return await getPrismaClient().login.update({
      where: {
        id: session.login.id
      },
      data: {
        verifyCode: randSixDigits()
      },
      select: {
        id: true,
        verifyCode: true,
        email: true
      }
    })
  } catch(err: any ) {
    console.error("Prisma Error: ", err)
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