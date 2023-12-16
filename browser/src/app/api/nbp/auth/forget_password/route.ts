import { forgetPassword } from "@/lib/auth";
import { assertSession, castAndValidateData } from "@/lib/guard";
import { fetchSession } from "@/lib/session";
import { ForbiddenError, InternalError } from "@/schema/error";
import { ForgetPasswordDataValidator } from "@/schema/validator";

export async function POST(req: Request) {
  const session = await fetchSession()

  try {
    if ( !!session || assertSession(session) ) {
      throw new ForbiddenError("Sign in Already")
    }

    const forgetPassowrdPayload = await req.json()
    const forgetPassowrdData = await castAndValidateData(forgetPassowrdPayload, ForgetPasswordDataValidator)

    const login = forgetPassword(forgetPassowrdData)
    if (!login) {
      //return success because we don't want to leak sensitive hint to the user.
    } else {
      //TODO: send email to user
    }

    return Response.json({
      code: 200,
      data: {
        name: 'Success',
        message: 'Please check your email',
      }
    }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (err: any) {
    console.error(session?.login?.id, err.toString())
    
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