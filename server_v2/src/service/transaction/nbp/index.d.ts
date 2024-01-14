
import type{ 
  Prisma, 
  PrismaClient, 
} from "@prisma/client"
import { DefaultArgs } from "@prisma/client/runtime/library.js"

export type PrismaTransaction = Omit<PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">
export type TRANSACTION_PROJET_TYPE = Prisma.TransactionGetPayload<{
  select: {
    id: true,
    status: true,
    cashIn: {
      select: {
        id: true,
        status: true,
        cashInReceiveAt: true,
        endInfo: true
      }
    },
    transfers: {
      select: {
        id: true,
        name: true,
        status: true,
        endInfo: true,
        externalRef: true,
        next: {
          select: {
            id: true
          }
        }
      }
    },
    ownerId: true
  }
}>