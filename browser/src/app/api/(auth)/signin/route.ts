import type {
  NextRequest
} from 'next/server'

//TODO: fecth from node backend.
export async function POST(req: NextRequest) {
  const signInData: ISignIn = await req.json()

  // TODO: signIn in back and and get JWT from there.
  // Front end can reuse JWT as they can sure same security.

  console.log(signInData)
  return Response.json({
      "loginId": "aaaa",
      "message": "success"
    },{
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
}