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
import { Login, LoginStatus } from '@prisma/client'
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

  try {
    const ns = await getPrismaClient().user.create({
      data: {
        firstName: onboardingData.firstName.trim(),
        middleName: onboardingData.middleName?.trim(),
        lastName: onboardingData.lastName.trim(),
        address1: onboardingData.address1.trim(),
        address2: onboardingData.address2?.trim(),
        city: onboardingData.city.trim(),
        province: onboardingData.province.trim(),
        country: onboardingData.country.trim(),
        postalCode: onboardingData.postalCode.trim(),
        phoneNumber: onboardingData.phoneNumber.trim(),
        dob: onboardingData.dob.trim(),
        pob: onboardingData.pob.trim(),
        nationality: onboardingData.nationality.trim(),
        // occupationId: onboardingData.occupation.trim(),
        identifications: {
          create: {
            type: onboardingData.identityType,
            value: onboardingData.identityNumber
          }
        }
      },
    })
    return await getSessionOrThrow(ns.id) 
  } catch (err: any) {
    throw new PrismaError(err.code, err.message)
  }
}