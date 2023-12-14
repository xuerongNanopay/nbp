import type { Session } from "@/types/auth";
import { getPrismaClient } from "@/utils/prisma";

export function assertSession(session: Session): boolean {
  if (!session) return false
  if (!session.login) return false
  return true
}

export function asserSessionOrThrow(session: Session) {
  if (!session) throw new AuthenticateError("Please Login!")
  if (!session.login) throw new AuthenticateError("Please Login!")
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
    // ValidationError
    throw new InvalidInputError(err.name, err.errors)
  }
}