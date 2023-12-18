import { formatSession } from "@/constants/log";
import { onboarding, reloadSession, reloadSessionOrThrow } from "@/lib/auth";
import { assertSession, castAndValidateData } from "@/lib/guard";
import { cleanSession, fetchSession, setSession } from "@/lib/session";
import { ForbiddenError, InternalError, UnauthenticateError } from "@/schema/error";
import { OnboardingDataValidator } from "@/schema/validator";
import type { OnboardingData } from "@/types/auth";
import { LoginStatus } from "@prisma/client";

export async function POST(req: Request) {
  const session = await fetchSession()

  try {
    if ( !session || !assertSession(session) ) {
      throw new UnauthenticateError('Please login')
    }
    
    //THINK: Using DB transaction?
    const s = await reloadSession(session.login.id)
    if ( !s || !s.login  || s.login.status !== LoginStatus.ACTIVE ) {
      throw new ForbiddenError('Please Valid Email')
    }

    if ( !!s.user ) throw new ForbiddenError('Duplicate User')

    const onboardPayload = await req.json()
    const onboardData = await castAndValidateData(onboardPayload, OnboardingDataValidator) as OnboardingData

    await onboarding(s, onboardData)
    const newSession = await reloadSession(session.login.id)
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
    console.error(formatSession(session), "onboarding-POST: ", err.toString())
    
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