import { fetchSession } from "@/lib/session";
import type { OnboardingData } from "@/types/auth";

export async function POST(req: Request, res: Response) {
  const onboadingPayload: OnboardingData = await req.json()
  console.log(onboadingPayload)
  const session = await fetchSession()
  if ( session === null ) {
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

  
}