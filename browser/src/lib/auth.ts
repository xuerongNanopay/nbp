import { Session, SignInData } from '@/type'
import { getPrismaClient } from '@/utils/prisma'

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
  return null;
}

export async function signUp(
  {

  }: SignUpDate
) {

}