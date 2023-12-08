import type {
  NextRequest
} from 'next/server'

import { setSession } from '@/lib/auth'

//TODO: fecth from node backend.
export async function POST(req: NextRequest) {
  const signInData: ISignIn = await req.json()

  //TODO: load user from DB.
  const user = {
    loginId: 111,
    userId: 222
  }

  await setSession({loginId: 111})

  console.log(signInData)
  return Response.json(user,{
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
}

export async function GET() {
  //TODO: load user from DB.
  const user = {
    loginId: 111,
    userId: 222
  }

  await setSession({loginId: 111})

  return Response.json(user,{
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
}