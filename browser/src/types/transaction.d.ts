import type { Prisma } from '@prisma/client'
  
export interface TransactionQuoteDate {
  sourceAccountId: number,
  destinationContactId: number,
  sourceAmount: number
}

export interface TransactionConfirmData {
  transactionId: number
}

export type TransactionQuoteResult = Prisma.TransactionGetPayload<{
  select: {
    id: true,
    sourceAccount: {
      select: {
        id: true,
        type: true,
        email: true,
        currency: true
      }
    },
    sourceAmount: true,
    sourceCurrency: true,
    destinationContact: {
      select: {
        id: true,
        firstName: true,
        lastName: true,
        type: true,
        status: true,
        institution: {
          select: {
            id: true,
            abbr: true,
            name: true
          }
        },
        bankAccountNum: true,
        branchNum: true,
        iban: true,
        currency: true
      }
    }
  }
}>