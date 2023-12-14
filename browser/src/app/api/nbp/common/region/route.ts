import { getRegionsByCountryCode } from "@/lib/common"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const countryCode = searchParams.get('countryCode') as string

  try {
    const regions = await getRegionsByCountryCode(countryCode)
    return Response.json(
      {
        code: 200,
        data: regions
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