import { 
  EmailVerifyData,
  ForgetPasswordData,
  Session, 
  SignInData,
  SignUpDate,
  OnboardingData
} from '@/type'
import { getPrismaClient } from '@/utils/prisma'
import { 
  SignUpDataValidator,
  EmailVerifyDataValidator,
  OnboardingDataValidator
} from '@/schema/validator'
import { AccountType, IdentificationType, Login, LoginStatus } from '@prisma/client'
import { randSixDigits } from '@/utils/idUtil'
import { 
  assertSession,
  validateData
} from './utils'
import IdentityType from '@/constants/IdentityType'

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

async function getSession(
  loginId: number
) : Promise<Session | null> {
  const login = await getPrismaClient().login.findUnique({
    where: {
      id: loginId    
    },
    select: Session_Project
  })
  if ( !login ) return null;

  return {
    login,
    user: login.owner
  }
}

async function getSessionOrThrow(
  loginId: number
) : Promise<Session> {
  const login = await getPrismaClient().login.findUnique({
    where: {
      id: loginId    
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

  //TODO: Hash password.
  const login = await getPrismaClient().login.findUnique({
    where: {
      email,
      password
    },
    select: Session_Project
  })

  if ( !login ) throw new AuthenticateError('Email or Password no found!')

  return {
    login,
    user: login.owner
  }
}

export async function signUp(
  signUpData: SignUpDate
): Promise<Login | null>  {
  
  await validateData(signUpData, SignUpDataValidator)

  const { email, password } = signUpData

  //TODO: hash password
  const login = await getPrismaClient().login.create({
    data: {
      email,
      password,
      verifyCode: randSixDigits()
    }
  })

  //TODO: send email to user

  return login
}

export async function verifyEmail(
  session: Session,
  emailVerifyData: EmailVerifyData
): Promise<Session> {

  assertSession(session)
  await validateData(emailVerifyData, EmailVerifyDataValidator)

  const s = await getSession(session.login.id)

  if (!s) throw new AuthenticateError("Please Login!")

  if (s.login.status !== LoginStatus.AWAIT_VERIFY) {
    return s
  }

  if (s.login.verifyCode !== emailVerifyData.code) {
    throw new AuthenticateError("Invalid Code")
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
    return await getSessionOrThrow(ns.id) 
  } catch (err: any) {
    throw new PrismaError(err.code, err.message)
  }
}

export async function refreshVerifyCode(
  session: Session,
) {
  assertSession(session)

  if ( session.login.status !== LoginStatus.AWAIT_VERIFY ) {
    throw new AuthenticateError("Login is verified")
  }

  try {
    const login = await getPrismaClient().login.update({
      where: {
        id: session.login.id
      },
      data: {
        verifyCode: randSixDigits()
      }
    })
    //TODO: send login.verifyCode to user email.
  } catch(err: any ) {
    throw new PrismaError(err.code, err.message)
  }
}

//TODO: send email to user with url+oneTimeToken
// Check your email.
// export async function retrieveLogin(
//   forgetPasswordDate: ForgetPasswordData
// ) {

// }

//TODO: onboarding
export async function onboarding(
  session: Session,
  onboardingData: OnboardingData
): Promise<Session> {
  
  assertSession(session)
  await validateData(onboardingData, OnboardingDataValidator)

  const s = await getSession(session.login.id)
  if (!s) throw new AuthenticateError("Please Login!")

  if ( s.user !== null ) {
    throw new AuthenticateError("Duplicate Onboarding")
  }

  const d = OnboardingDataValidator.cast(onboardingData) as OnboardingData
  const idType = mapToIdentificationType(d.identityType)
  try {
    const ns = await getPrismaClient().user.create({
      data: {
        firstName: d.firstName,
        middleName: d.middleName,
        lastName: d.lastName,
        address1: d.address1,
        address2: d.address2,
        city: d.city,
        province: d.province,
        country: d.country,
        postalCode: d.postalCode,
        phoneNumber: d.phoneNumber,
        dob: d.dob,
        pob: d.pob,
        nationality: d.nationality,
        occupationId: d.occupationId,
        identification: {
          create: {
            type: idType,
            value: d.identityNumber,
          }
        },
        accounts: {
          create: {
            type: AccountType.INTERACT,
            email: d.interacEmail,
            isDefault: true
          }
        },
        logins: {
          connect: {
            id: s.login.id
          }
        }
      },
    })
    return await getSessionOrThrow(ns.id) 
  } catch (err: any) {
    throw new PrismaError(err.code, err.message)
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