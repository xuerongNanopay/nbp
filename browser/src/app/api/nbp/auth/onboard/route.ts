import { onboarding, reloadSession } from "@/lib/auth";
import { assertSession, castAndValidateData, validateData } from "@/lib/guard";
import { fetchSession, setSession } from "@/lib/session";
import { OnboardingDataValidator } from "@/schema/validator";
import type { OnboardingData } from "@/types/auth";
import { LoginStatus } from "@prisma/client";

export async function POST(req: Request) {
  const onboadingPayload: OnboardingData = await req.json()

  const session = await fetchSession()

  if ( session === null || !assertSession(session) ) {
    return Response.json({
      code: '401',
      message: 'Unauthentication Error'
    }, {
      status: 401,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  try {
    const s = await reloadSession(session.login.id)
    if ( !s || !s.login  || s.login.status !== LoginStatus.ACTIVE ) {
      return Response.json({
        code: '401',
        message: 'Unauthorized: login is not active'
      }, {
        status: 401,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }

    if ( !!s.user ) {
      return Response.json({
        code: '403',
        message: 'Forbidden: duplicated user'
      }, {
        status: 403,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }

    const onboardPayload = await req.json()
    let onboardData: OnboardingData

    try {
      onboardData = await castAndValidateData(onboardPayload, OnboardingDataValidator) as OnboardingData
    } catch ( err: any ) {
      return Response.json({
        code: '400',
        name: err.name,
        message: err.message,
        errors: err.errors
      }, {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }

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

  } catch (err) {
    console.log(err)
    return Response.json({
      code: '500',
      message: 'Internal Server Error'
    }, {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

}