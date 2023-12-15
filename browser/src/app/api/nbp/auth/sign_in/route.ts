import type {
  NextRequest
} from 'next/server'

import { SignInData } from '@/types/auth'

//TODO: fecth from node backend.
export async function POST(req: NextRequest) {
  const signInData: SignInData = await req.json()

  //TODO: load user from DB.
  const user = {
    loginId: 111,
    userId: 222
  }

  return Response.json(user,{
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
}