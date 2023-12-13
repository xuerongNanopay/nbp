import { 
  getPersinoalRelationships
} from "@/lib/common"

export async function GET(request: Request) {

  try {
    const relstionships = await getPersinoalRelationships()
    return Response.json(
      {
        code: 200,
        data: relstionships
      },
      {
        status: 200
      }
    )
  } catch ( err ) {
    console.log(err)
    return Response.json(
      {
        code: 500,
        message: 'Internal Error'
      },
      {
        status: 500
      }
    )
  }
}