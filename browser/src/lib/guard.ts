import { InvalidInputError, UnauthenticateError } from "@/schema/error";
import type { Session } from "@/types/auth";
import { UserStatus } from "@prisma/client";

export function assertSession(session: Session | null): boolean {
  if (!session) return false
  if (!session.login) return false
  return true
}

export function assertActiveUser(session: Session | null): boolean {
  if (!assertSession(session)) return false
  if (!session?.user) return false
  if (session.user.status !== UserStatus.ACTIVE) return false
  return true
}

export function assertNotDeleteUser(session: Session | null): boolean {
  if (!assertSession(session)) return false
  if (!session?.user) return false
  if (session.user.status === UserStatus.DELETE) return false
  return true
}

export function asserSessionOrThrow(session: Session) {
  if (!session) throw new UnauthenticateError("Please Login!")
  if (!session.login) throw new UnauthenticateError("Please Login!")
}

// export function assertUserSession(session: Session) {
//   assertSession(session)
//   if (!session.user) throw new AuthenticateError("Please Login!")
// }

// //TODO: look up really user in db.
// export async function assertUserSessionStrict(session: Session) {
//   assertSession(session)
//   await getSession(session.login.id)
// }

export async function validateData(data: any, validator: any) {
  try {
    await validator.validate(data, {strict: true})
  } catch (err: any) {
    throw new InvalidInputError('wrong input format', err.errors)
  }
}

export async function castAndValidateData(data: any, validator: any): Promise<any> {
  let ret = validator.cast(data) 
  if (!ret) throw new InvalidInputError('wrong input format')

  try {
    await validator.validate(ret, {strict: true})
    return ret
  } catch (err: any) {
    throw new InvalidInputError('wrong input format', err.errors)
  }
}