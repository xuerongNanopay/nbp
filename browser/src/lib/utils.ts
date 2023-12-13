import { Session } from "@/type";

export function assertSession(session: Session) {
  if (!session) throw new AuthenticateError("Please Login!")
  if (!session.login) throw new AuthenticateError("Please Login!")
}

export function assertUserSession(session: Session) {
  assertSession(session)
  if (!session.user) throw new AuthenticateError("Please Login!")
}

export async function validateData(data: any, validator: any) {
  try {
    await validator.validate(data, {strict: true})
  } catch (err: any) {
    // ValidationError
    throw new InvalidInputError(err.name, err.errors)
  }
}