import { formatSession } from "@/constants/log";
import { reloadSession, verifyEmail } from "@/lib/auth";
import { assertSession, castAndValidateData } from "@/lib/guard";
import { 
  cleanSession, 
  fetchSession, 
  setSession
} from "@/lib/session";
import { ForbiddenError, InvalidInputError, UnauthenticateError } from "@/schema/error";
import { EmailVerifyDataValidator } from "@/schema/validator";
import { EmailVerifyData } from "@/types/auth";
import { LoginStatus } from "@prisma/client";

export async function POST(req: Request) {
  const session = await fetchSession()

  try {
    if (!session || !assertSession(session)) throw new UnauthenticateError("Please Login")
    if ( session.login.status !== LoginStatus.AWAIT_VERIFY ) throw new ForbiddenError("Email Verified already")

    const emailVerifyPayload = await req.json()
    const emailVerifyData = await castAndValidateData(emailVerifyPayload, EmailVerifyDataValidator) as EmailVerifyData
    const login = await verifyEmail(session, emailVerifyData)

    //TODO: set maximum code attempts
    if (!login) throw new InvalidInputError("Code do not match")

    const newSession = await reloadSession(login.id)
    await setSession(newSession)

    return Response.json({
      code: 200,
      data: {
        login: newSession?.login,
        user: newSession?.user
      }
    }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (err: any) {
    console.error(formatSession(session), "verify_email-POST: ", err.toString())

    const errorResponse = !err.errors ? {
      code: err.code,
      name: err.name,
      message: err.message
    } : {
      code: err.code,
      name: err.name,
      message: err.message,
      errors: err.errors
    }
    return Response.json(errorResponse, {
      status: err.code ?? 500,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}