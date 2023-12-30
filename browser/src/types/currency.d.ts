import type { Prisma } from '@prisma/client'

export type CurrencyRate = Prisma.CurrencyRateGetPayload<({
  select: {
    sourceCurrency: true,
    destinationCurrency: true,
    value: true
  }
})>