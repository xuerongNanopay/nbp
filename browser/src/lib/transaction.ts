import { DAILY_TRANSATION_LIMIT } from "@/constants/env";
import { ForbiddenError, InternalError, NBPError } from "@/schema/error";
import { Session } from "@/types/auth";
import { 
  TransactionConfirmData, 
  TransactionQuoteDate 
} from "@/types/transaction";
import { LOGGER, formatSession } from "@/utils/logUtil";
import { getPrismaClient } from "@/utils/prisma";
import { Time } from "@/utils/timeUtil";
import { AccountStatus, ContactStatus, TransactionStatus, UserStatus } from "@prisma/client";

export async function quoteTransaction(
  session: Session, 
  transactionQuoteDate: TransactionQuoteDate
) : Promise<null> 
{
  //Ensure both user and login are active.
  //Ensure both account and contact are active.
  //Ensure not exceed the daily limit.
  //Create transaction.

  try {
    const userPromise = await getPrismaClient().user.findUnique({
      where: {
        id: session.user?.id,
      },
      select: {
        id: true,
        status: true
      }
    })
    const accountPromise = await getPrismaClient().account.findUnique({
      where: {
        id: transactionQuoteDate.sourceAccountId,
        ownerId: session.user?.id
      },
      select: {
        id: true,
        status: true
      }
    })
    const contactPromise = await getPrismaClient().contact.findUnique({
      where: {
        id: transactionQuoteDate.sourceAccountId,
        ownerId: session.user?.id
      },
      select: {
        id: true,
        status: true
      }
    })
    //THINK: Get transactions, then compare. Or, Let DB handle the query.
    //MOVE: move to confirm transaction.
    //Something to Battle.
    const usedAmountPromise = await getPrismaClient().transaction.aggregate({
      _sum: {
        sourceAmount: true
      },
      where: {
        ownerId: session.user?.id,
        createdAt: {
          //TODO: check if it is Toronto locale.
          gte: Time().startOf('day').toDate()
        },
        status: {
          in: [
            TransactionStatus.COMPLETE,
            TransactionStatus.INITIAL,
            TransactionStatus.PROCESS,
            TransactionStatus.WAITING_FOR_PAYMENT
          ]
        }
      }
    })

    const mostRecentTransactionPromise = await getPrismaClient().transaction.findFirst({
      where: {
        ownerId: session.user?.id
      },
      orderBy: {
        id: 'desc'
      },
      select: {
        id: true,
        status: true,
        createdAt: true
      }
    })

    const rets = await Promise.all([
                                    userPromise, 
                                    accountPromise, 
                                    contactPromise, 
                                    usedAmountPromise,
                                    mostRecentTransactionPromise
                                  ])
    const [user, account, contact, usedAmount, mostRecentTransaction] = rets

    if (!user || user.status != UserStatus.ACTIVE) throw new ForbiddenError("Forbidden User")
    if (!account || account.status != AccountStatus.ACTIVE) throw new ForbiddenError("Forbidden Account")
    if (!contact || contact.status != ContactStatus.ACTIVE) throw new ForbiddenError("Forbidden Contact")

    if (
      (DAILY_TRANSATION_LIMIT*100 - 
      (!usedAmount._sum.sourceAmount ? 0 : usedAmount._sum.sourceAmount)*100)
      < 0
    ) throw new ForbiddenError(`Over Limit: \$${DAILY_TRANSATION_LIMIT}.00 per day`)

    if ( !!mostRecentTransaction &&
      (mostRecentTransaction.createdAt.getTime() - new Date().getTime()) < 4000 // It is no possible for a user to create two transaction within 4 seconds.
    ) throw new ForbiddenError("Please try later")

    // Pass all safety check. Save to create account.
    return null
  }  catch (err) {
    if ( err instanceof NBPError) throw err
    LOGGER.error(formatSession(session), "Method: quoteTransaction", err)
    throw new InternalError()
  }
}



async function confirmTransaction(session: Session, transactionConfirmData: TransactionConfirmData) {
  try {

    const transactionPromise = await getPrismaClient().transaction.findUnique({
      where: {
        id: transactionConfirmData.transactionId,
        status: TransactionStatus.QUOTE,
        owner: session.user?.id,
      },
      select: {
        id: true,
        quoteExpired: true
      }
    })

    const usedAmountPromise = await getPrismaClient().transaction.aggregate({
      _sum: {
        sourceAmount: true
      },
      where: {
        ownerId: session.user?.id,
        createdAt: {
          //TODO: check if it is Toronto locale.
          gte: Time().startOf('day').toDate()
        },
        status: {
          in: [
            TransactionStatus.COMPLETE,
            TransactionStatus.INITIAL,
            TransactionStatus.PROCESS,
            TransactionStatus.WAITING_FOR_PAYMENT
          ]
        }
      }
    })

    const rets = await Promise.all([transactionPromise, usedAmountPromise])
    const [transaction, usedAmount] = rets

    if (
      (DAILY_TRANSATION_LIMIT*100 - 
      (!usedAmount._sum.sourceAmount ? 0 : usedAmount._sum.sourceAmount)*100)
      < 0
    ) throw new ForbiddenError(`Over Limit: \$${DAILY_TRANSATION_LIMIT}.00 per day`)

    if (!transaction) throw new ForbiddenError("Transaction no found")
    if (transaction.quoteExpired.getTime() < new Date().getTime()) throw new ForbiddenError("Quote expired")

    getPrismaClient().transaction.update({
      where: {
        id: transactionConfirmData.transactionId,
        status: TransactionStatus.QUOTE,
        owner: session.user?.id,
      },
      data: {
        status: TransactionStatus.INITIAL,
        confirmQuoteAt: new Date()
      }
    })

  }  catch (err) {
    if ( err instanceof NBPError) throw err
    LOGGER.error(formatSession(session), "Method: quoteTransaction", err)
    throw new InternalError()
  }
}

async function getTransactionsByOwnerId(
  session: Session,
  options?: {
    from?: Number,
    size?: Number,
    statuses?: TransactionStatus[]
  }
) {

}

async function countTransactions(
  session: Session,
  options?: {
    statuses?: TransactionStatus[]
  }
) {

}

async function getTransactionDetailByOwnerId(
  session: Session, 
  transactionId: number
) {

}