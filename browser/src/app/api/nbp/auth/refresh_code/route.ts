import { refreshVerifyCode } from "@/lib/auth";
import { assertSession } from "@/lib/guard";
import { fetchSession } from "@/lib/session";
import { ForbiddenError, InternalError, UnauthenticateError } from "@/schema/error";
import { LoginStatus } from "@prisma/client";

export async function GET() {
  const session = await fetchSession()

  try {
    if (!session || !assertSession(session)) throw new UnauthenticateError("Please Login")
    if ( session.login.status !== LoginStatus.AWAIT_VERIFY ) throw new ForbiddenError("Email Verified already")

    const login = await refreshVerifyCode(session)
    if (!login) throw new InternalError()

    return Response.json({
      code: 200,
      data: {
        message: 'Created new Verify Code',
        email: login.email
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