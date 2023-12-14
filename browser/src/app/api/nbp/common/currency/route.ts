import { 
  getCurrencies
} from "@/lib/common"

export async function GET() {

  try {
    const currencies = await getCurrencies()
    return Response.json(
      {
        code: 200,
        data: currencies
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