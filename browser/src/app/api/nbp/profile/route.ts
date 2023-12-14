import { onboarding, reloadSession } from "@/lib/auth";
import { assertSession } from "@/lib/guard";
import { fetchSession, setSession } from "@/lib/session";
import type { OnboardingData } from "@/types/auth";
import { LoginStatus } from "@prisma/client";

export async function POST(req: Request, res: Response) {
  const onboadingPayload: OnboardingData = await req.json()
  console.log(onboadingPayload)
  const session = await fetchSession()
  // TODO: mut this guard to middle ware
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

    const payload = await req.json()
    const newSession = await onboarding(s, payload)

    setSession(newSession)
    return Response.json({
      code: '201',
      data: {
        login: newSession?.login,
        user: newSession?.user
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