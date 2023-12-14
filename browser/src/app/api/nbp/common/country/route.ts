import { 
  getCountries
} from "@/lib/common"

export async function GET() {

  try {
    const countries = await getCountries()
    return Response.json(
      {
        code: 200,
        data: countries
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