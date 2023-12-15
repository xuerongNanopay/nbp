import { assertSession } from "@/lib/guard";
import { fetchSession } from "@/lib/session";
import { ForbiddenError } from "@/schema/error";
import { SignUpData } from "@/types/auth";

export async function POST(req: Request) {
  try {
    const session = await fetchSession()
    if ( assertSession(session) ) {
      throw new ForbiddenError("Please log out before create new user")
    }


  } catch (err: any) {
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