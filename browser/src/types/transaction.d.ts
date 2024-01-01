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
    },
    destinationAmount: true,
    destinationCurrency: true,
    feeAmount: true,
    feeCurrency: true,
    debitAmount: true,
    debitCurrency: true
  }
}>

export type TransactionConfirmResult = Prisma.TransactionGetPayload<{
  select: {
    id: true,
    cashIn: {
      select: {
        id: true,
        status: true,
        method: true,
        paymentLink: true
      }
    }
  }
}>

export type GetTransaction = Prisma.TransactionGetPayload<{
  select: {
    id: true,
    status: true,
    createdAt: true,
    sourceAmount: true,
    sourceCurrency: true,
    destinationAmount: true,
    destinationCurrency: true,
  }
}>