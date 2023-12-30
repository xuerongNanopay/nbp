import { InternalError } from "@/schema/error";
import { Session } from "@/types/auth";
import { CurrencyRate } from "@/types/currency";
import { LOGGER, formatSession } from "@/utils/logUtil";
import { getPrismaClient } from "@/utils/prisma";

export async function getCurrencyRate(
  session: Session,
  sourceCurrency: string, 
  destinationCurrency: string
) : Promise<CurrencyRate | null> {
  try {
    const currencyRate = await getPrismaClient().currencyRate.findFirst({
      where: {
        sourceCurrency: sourceCurrency,
        destinationCurrency: destinationCurrency
      },
      select: {
        sourceCurrency: true,
        destinationCurrency: true,
        value: true
      }
    })
    return currencyRate
  } catch (err: any) {
    LOGGER.error(`${formatSession(session)}`, 'Method: getCurrencyRate', err)
    throw new InternalError()
  }
}