import { onboarding, reloadSession } from "@/lib/auth";
import { assertSession, castAndValidateData } from "@/lib/guard";
import { fetchSession, setSession } from "@/lib/session";
import { OnboardingDataValidator } from "@/schema/validator";
import type { OnboardingData } from "@/types/auth";
import { LoginStatus } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const session = await fetchSession()

    if ( session === null || !assertSession(session) ) {
      throw new UnauthenticateError('Please login')
    }

    const s = await reloadSession(session.login.id)
    if ( !s || !s.login  || s.login.status !== LoginStatus.ACTIVE ) {
      throw new ForbiddenError('Please Valid Email')
    }

    if ( !!s.user ) throw new ForbiddenError('Duplicate User')

    const onboardPayload = await req.json()
    const onboardData = await castAndValidateData(onboardPayload, OnboardingDataValidator) as OnboardingData

    const newSession = await onboarding(s, onboardData)

    setSession(newSession)
    return Response.json({
      code: '201',
      data: {
        login: newSession?.login,
        user: newSession?.user
      }
    }, {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    })

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