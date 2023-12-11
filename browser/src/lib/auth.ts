import { 
  Session, 
  SignInData,
  SignUpDate
} from '@/type'
import { getPrismaClient } from '@/utils/prisma'
import { SignUpDataValidator } from '@/schema/validator'
import { Login } from '@prisma/client'
import { randSixDigits } from '@/utils/idUtil'

export async function signIn(
  {
    email,
    password
  }: SignInData
): Promise<Session | null> {

  //TODO: Hash password.
  const login = await getPrismaClient().login.findUnique({
    where: {
      email,
      password
    },
    select: {
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
  })
  if ( !login ) return null

  return {
    login,
    user: login.owner
  };
}

export async function signUp(
  signUpData: SignUpDate
): Promise<Login | null>  {
  
  try {
    await SignUpDataValidator.validate(signUpData, {strict: true})
  } catch (err: any) {
    // ValidationError
    throw new InvalidInputError(err.name, err.errors)
  }

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