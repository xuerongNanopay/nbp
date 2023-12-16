import type {
  NextRequest
} from 'next/server'

import { SignInData } from '@/types/auth'
import { fetchSession, setSession } from '@/lib/session'
import { assertSession, castAndValidateData } from '@/lib/guard'
import { ForbiddenError } from '@/schema/error'
import { SignInDataValidator } from '@/schema/validator'
import { signIn } from '@/lib/auth'

//TODO: fecth from node backend.
export async function POST(req: NextRequest) {
  const session = await fetchSession()

  try {
    if ( !!session || assertSession(session) ) {
      throw new ForbiddenError("Please log out before create new user")
    }

    const signInPayload = await req.json()
    const signInData = await castAndValidateData(signInPayload, SignInDataValidator) as SignInData
    const newSession = await signIn(signInData)
    await setSession(newSession)

    return Response.json({
      code: 200,
      data: newSession
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