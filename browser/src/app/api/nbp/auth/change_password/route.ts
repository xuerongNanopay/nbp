import { LOGGER, formatSession } from '@/utils/logUtil'
import { changePassowrd } from "@/lib/auth";
import { assertSession, castAndValidateData } from "@/lib/guard";
import { fetchSession } from "@/lib/session";
import { ForbiddenError, InternalError } from "@/schema/error";
import { ChangePassowrdDataValidator } from "@/schema/validator";
import { ChangePassowrdData } from "@/types/auth";

export async function POST(req: Request) {
  const session = await fetchSession()

  try {
    if ( !!session || assertSession(session) ) {
      throw new ForbiddenError("Sign in Already")
    }

    const changePasswordPayload = await req.json()
    const changePasswordData = await castAndValidateData(changePasswordPayload, ChangePassowrdDataValidator) as ChangePassowrdData

    const login = await changePassowrd(changePasswordData)
    if (!login) throw new InternalError()

    //TODO: log password change for security purpose
    //TODO: send email to notify user.

    return Response.json({
      code: 200,
      data: {
        name: 'Success',
        message: 'Password Change Success. Please login in',
      }
    }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (err: any) {
    LOGGER.error(`${formatSession(session)}`, "API: change_password-POST", err)
    
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