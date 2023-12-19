import type { 
  ChangePassowrdData,
  EmailVerifyData,
  ForgetPasswordData,
  OnboardingData,
  Session, 
  SignInData,
  SignUpData,
} from '@/types/auth'
import { getPrismaClient } from '@/utils/prisma'
import { AccountType, IdentificationType, Login, LoginStatus, User } from '@prisma/client'
import { randSixDigits } from '@/utils/idUtil'
import { v4 as uuidv4 } from 'uuid'

import { 
  ForbiddenError,
  InternalError, 
  InvalidInputError, 
  NBPError, 
  ResourceNoFoundError, 
  UnauthenticateError 
} from '@/schema/error'
import { RECOVER_TOKEN_TIME_OUT_SEC } from '@/constants/env'
import { LOGGER, formatSession } from '@/utils/logUtil'

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
    LOGGER.error(`loginId: ${loginId}`, "method: reloadSession", err)
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

  try {
    //TODO: Hash passwordata.
    const login = await getPrismaClient().login.findUnique({
      where: {
        email,
        password,
        status: {
          not: LoginStatus.DELETE
        }
      },
      select: Session_Project
    })

    if ( !login ) throw new UnauthenticateError('Email or Password failed!')

    return {
      login,
      user: login.owner
    }
  } catch(err: any ) {
    if ( err instanceof NBPError ) throw err
    
    LOGGER.error(`email: ${email}`, "method: signIn", err)
    throw new InternalError()
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

    LOGGER.error(`signUpData: ${JSON.stringify(signUpData)}` + 'method: signUp', err)
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
      LOGGER.error(`${formatSession(session)}`, "method: verifyEmail", err)
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
    LOGGER.error(`${formatSession(session)}`, "method: refreshVerifyCode", err)

    throw new InternalError()
  }
}

export async function forgetPassword(
  data: ForgetPasswordData
): Promise<
Pick<Login, 'id' | 'recoverToken' | 'recoverTokenExpireAt' | 'email'>
| null> {
  try {
    const login = await getPrismaClient().login.findUnique({
      where: {
        email: data.email,
        status: {
          not: LoginStatus.DELETE
        }
      },
      select: {
        id: true,
        recoverToken: true,
        recoverTokenExpireAt: true,
        email: true
      }
    })
    if (!login) {
      console.warn("Forget password request", "email no found", `email: ${data.email}`)
      return null
    }
    if (!!login.recoverTokenExpireAt && login.recoverTokenExpireAt.getTime() > new Date().getTime()) {
      console.warn("Forget password request", "recoverToken is still valid", `email: ${data.email}`)
      return null
    }

    return await getPrismaClient().login.update({
      where: {
        id: login.id
      },
      data: {
        recoverToken: uuidv4(),
        recoverTokenExpireAt: new Date(new Date().getTime() + RECOVER_TOKEN_TIME_OUT_SEC*1000)
      },
      select: {
        id: true,
        recoverToken: true,
        recoverTokenExpireAt: true,
        email: true
      }
    })

  } catch(err: any ) {
    LOGGER.error(`forgetPasswordData: ${JSON.stringify(data)}`, "method: forgetPassword", err)

    throw new InternalError()
  }
}

export async function changePassowrd(
  {email, oneTimeToken, newPassword}: ChangePassowrdData
): Promise<Pick<Login, 'id'| 'email'> | null> {
  try {
    const login = await getPrismaClient().login.findUnique({
      where: {
        email,
        status: {
          not: LoginStatus.DELETE
        }   
      },
      select: {
        id: true,
        email: true,
        recoverToken: true,
        recoverTokenExpireAt: true
      }
    })
    if ( !login ) throw new ForbiddenError("Unable to update password")
    if ( !login.recoverToken || 
          login.recoverToken !== oneTimeToken ||
          !login.recoverTokenExpireAt ||
          login.recoverTokenExpireAt.getTime() > new Date().getTime()
    ) {
      throw new InvalidInputError("Token expired! please ask for new one")
    }

    //TODO: hash password
    return await getPrismaClient().login.update({
      where: {
        id: login.id
      },
      data: {
        recoverToken: null,
        recoverTokenExpireAt: null,
        password: newPassword
      },
      select: {
        id: true,
        email: true
      }
    })

  } catch (err: any) {
    if ( err instanceof NBPError ) throw err

    console.error(`changePasswordData: ${JSON.stringify({email, oneTimeToken})}`,  "method: changePassowrd", err)
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
            currency: 'CAD',
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
    LOGGER.error(`${formatSession(session)}`, "method: onboarding", err)
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
      throw new InvalidInputError("Onboarding Error", [`Invalid Identification Type: ${identityType}`])
  }
}