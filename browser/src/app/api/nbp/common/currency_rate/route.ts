import { getCurrencyRate } from "@/lib/currencyRate";
import { assertSession } from "@/lib/guard";
import { fetchSession } from "@/lib/session";
import { ResourceNoFoundError, UnauthenticateError } from "@/schema/error";
import type { CurrencyRate } from "@/types/currency";
import { HttpGET } from "@/types/http";
import { LOGGER, formatSession } from "@/utils/logUtil";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sourceCurrency = searchParams.get('sourceCurrency') as string
  const destinationCurrency = searchParams.get('destinationCurrency') as string
  const session = await fetchSession()

  try {
    if (!session || !assertSession(session))  throw new UnauthenticateError("Please Login")

    //THINK: SQL Injection???
    if (!sourceCurrency || !destinationCurrency) throw new ResourceNoFoundError("Currency rate no found.")

    const currencyRate = await getCurrencyRate(session, sourceCurrency, destinationCurrency)
    if (!currencyRate) throw new ResourceNoFoundError("Currency rate no found.")

    const response: HttpGET<CurrencyRate> = {
      code: 200,
      message: 'Fetch rate successfully!',
      payload: {
        meta: {
          timestamp: new Date()
        },
        single: currencyRate
      }
    }

    return Response.json(response, {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (err: any) {
    LOGGER.error(`${formatSession(session)}`, "API: currency_rate-GET", err)

    const errorResponse = !err.errors ? {
      code: err.code,
      name: err.name,
      message: err.message
    } : {
      code: err.code,
      name: err.name,
      message: err.message,
      errors: err.errors
    }
    return Response.json(errorResponse, {
      status: err.code ?? 500,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}