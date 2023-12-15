import { assertSession, castAndValidateData } from "@/lib/guard";
import { fetchSession } from "@/lib/session";
import { ForbiddenError } from "@/schema/error";
import { SignUpDataValidator } from "@/schema/validator";
import { SignUpData } from "@/types/auth";

export async function POST(req: Request) {
  const session = await fetchSession()

  try {
    if ( assertSession(session) ) {
      throw new ForbiddenError("Please log out before create new user")
    }

    const signUpPayload = await req.json()
    const signUpData = await castAndValidateData(signUpPayload, SignUpDataValidator) as SignUpData
    

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