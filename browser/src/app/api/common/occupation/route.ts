import { 
  getOccupations
} from "@/lib/common"

export async function GET() {

  try {
    const occupations = await getOccupations()
    return Response.json(
      {
        code: 200,
        data: occupations
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