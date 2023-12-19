import { LOGGER, formatSession } from '@/utils/logUtil'
import { reloadSession, signUp } from "@/lib/auth";
import { assertSession, castAndValidateData } from "@/lib/guard"
import { cleanSession, fetchSession, setSession } from "@/lib/session"
import { ForbiddenError, InternalError } from "@/schema/error"
import { SignUpDataValidator } from "@/schema/validator"
import { SignUpData } from "@/types/auth"

export async function POST(req: Request) {
  const session = await fetchSession()

  try {
    if ( assertSession(session) ) {
      throw new ForbiddenError("Please log out before create new user")
    }

    const signUpPayload = await req.json()
    const signUpData = await castAndValidateData(signUpPayload, SignUpDataValidator) as SignUpData
    const login = await signUp(signUpData)

    if (!login) throw new InternalError()

    const newSession = await reloadSession(login.id)
    if (!newSession) throw new InternalError()
    await setSession(newSession)

    return Response.json({
      code: 201,
      data: {
        login: newSession?.login,
        user: newSession?.user
      }
    }, {
      status: 201,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (err: any) {
    LOGGER.error(`${formatSession(session)}`, "API: sign_up-POST", err)

    await cleanSession()

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