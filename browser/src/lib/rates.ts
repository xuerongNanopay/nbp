import { CurrencyRate } from "@/types/currency";
import { getPrismaClient } from "@/utils/prisma";

async function getRate(
  sourceCurrency: string, 
  destinationCurrency: string
) : Promise<CurrencyRate | null> {
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
}