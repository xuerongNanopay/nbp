import type {
  NextRequest
} from 'next/server'

import { setSession } from '@/lib/auth'
import { SessionPayload } from '@/utils/cookieUtil'

const dummySessionPayload: SessionPayload = {
  loginId: 11111111111,
  userId: 55555555555,
  username: 'Xufdsafd Wu',
  loginStatus: 'active',
  thumbnail: 'ffffffffffffffffffffffffffffffffffffffffff',
  userStatus: 'active',
  isVerifyEmail: true,
  isOnboarding: true,
  role: ['ADMIN', "NBP_USER"]
}

//TODO: fecth from node backend.
export async function POST(req: NextRequest) {
  const signInData: ISignIn = await req.json()

  //TODO: load user from DB.
  const user = {
    loginId: 111,
    userId: 222
  }

  await setSession(dummySessionPayload)

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

  await setSession(dummySessionPayload)

  return Response.json(user,{
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
}