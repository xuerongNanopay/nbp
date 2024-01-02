import { DAILY_TRANSATION_LIMIT, QUOTE_EXPIRE_SEC } from "@/constants/env";
import { ForbiddenError, InternalError, NBPError, ResourceNoFoundError } from "@/schema/error";
import { Session } from "@/types/auth";
import { 
  GetTransactionDetail,
  GetTransactions,
  TransactionConfirmData, 
  TransactionConfirmResult, 
  TransactionQuoteDate, 
  TransactionQuoteResult
} from "@/types/transaction";
import { LOGGER, formatSession } from "@/utils/logUtil";
import { getPrismaClient } from "@/utils/prisma";
import { Time } from "@/utils/timeUtil";
import { AccountStatus, ContactStatus, TransactionStatus, UserStatus } from "@prisma/client";

export async function quoteTransaction(
  session: Session, 
  transactionQuoteDate: TransactionQuoteDate
) : Promise<TransactionQuoteResult> 
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
        currency: true,
        status: true
      }
    })
    const contactPromise = await getPrismaClient().contact.findUnique({
      where: {
        id: transactionQuoteDate.destinationContactId,
        ownerId: session.user?.id
      },
      select: {
        id: true,
        currency: true,
        status: true,
        firstName: true,
        lastName: true
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
    const [
      user, 
      account, 
      contact, 
      usedAmount, 
      mostRecentTransaction
    ] = rets

    if (!user || user.status != UserStatus.ACTIVE) throw new ForbiddenError("Forbidden User")
    if (!account || account.status != AccountStatus.ACTIVE) throw new ForbiddenError("Forbidden Account")
    if (!contact || contact.status != ContactStatus.ACTIVE) throw new ForbiddenError("Forbidden Contact")

    if (
      (DAILY_TRANSATION_LIMIT*100 - 
      (!usedAmount._sum.sourceAmount ? 0 : usedAmount._sum.sourceAmount))
      < 0
    ) throw new ForbiddenError(`Over Limit: \$${DAILY_TRANSATION_LIMIT}.00 per day`)

    if ( !!mostRecentTransaction &&
      (new Date().getTime() - mostRecentTransaction.createdAt.getTime()) < 2000 // It is no possible for a user to create two transaction within 4 seconds.
    ) throw new ForbiddenError("Quote too frequently.")


    const exchangeRate = await getPrismaClient().currencyRate.findFirst({
      where: {
        sourceCurrency: account.currency,
        destinationCurrency: contact.currency
      },
      select: {
        id: true,
        value: true
      }
    })

    if ( !exchangeRate ) throw new ForbiddenError("Exchange rate not support")
    
    //TODO: fee calculate. 
    const rateConvertedAmount = Math.round((transactionQuoteDate.sourceAmount) * exchangeRate.value * 100) 
    const totalFee = 200 //TODO: change.
    const debitAmount = rateConvertedAmount + totalFee

    const transaction = await getPrismaClient().transaction.create({
      data: {
        name: 'NBP_Transaction',
        status: TransactionStatus.QUOTE,
        sourceAccountId: account.id,
        destinationContactId: contact.id,
        sourceAmount: Math.round(transactionQuoteDate.sourceAmount*100),
        sourceCurrency: account.currency,
        destinationAmount: rateConvertedAmount,
        destinationCurrency: contact.currency,
        destinationName: `${contact.firstName} ${contact.lastName}`,
        feeAmount: totalFee,
        feeCurrency: account.currency,
        debitAmount: debitAmount,
        debitCurrency: account.currency,
        ownerId: session.user!.id,
        quoteExpired: new Date(new Date().getTime() + QUOTE_EXPIRE_SEC*1000)
      },
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
    })
    return transaction
  }  catch (err) {
    if ( err instanceof NBPError) throw err
    LOGGER.error(formatSession(session), "Method: quoteTransaction", err)
    throw new InternalError()
  }
}



export async function confirmTransaction(
  session: Session, 
  transactionConfirmData: TransactionConfirmData
) : Promise<TransactionConfirmResult> {
  try {

    const transactionPromise = await getPrismaClient().transaction.findUnique({
      where: {
        id: transactionConfirmData.transactionId,
        status: TransactionStatus.QUOTE,
        ownerId: session.user!.id,
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
        ownerId: session.user!.id,
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
      (!usedAmount._sum.sourceAmount ? 0 : usedAmount._sum.sourceAmount))
      < 0
    ) throw new ForbiddenError(`Over Limit: \$${DAILY_TRANSATION_LIMIT}.00 per day`)

    if (!transaction) throw new ForbiddenError("Transaction no found")
    if (transaction.quoteExpired.getTime() < new Date().getTime()) throw new ForbiddenError("Quote expired")

    const updateTransaction = getPrismaClient().transaction.update({
      where: {
        id: transactionConfirmData.transactionId,
        status: TransactionStatus.QUOTE,
        ownerId: session.user?.id,
      },
      data: {
        status: TransactionStatus.INITIAL,
        confirmQuoteAt: new Date()
      },
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
    })

    //TODO: send to Transaction Processor.

    return updateTransaction
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
    searchKey?: String,
    statuses?: TransactionStatus[]
  }
) : Promise<GetTransactions> {
  // const wherePredicate = { take: 50 } // Maximum size for each query
  // if (!!options?.from) 
  try {
    const transactions = await getPrismaClient().transaction.findMany({
      where: {
        ownerId: session.user!.id,
        status: {
          not: TransactionStatus.QUOTE
        }
      },
      orderBy: {
        id: 'desc'
      },
      select: {
        id: true,
        status: true,
        createdAt: true,
        sourceAmount: true,
        sourceCurrency: true,
        destinationAmount: true,
        destinationCurrency: true,
        destinationName: true
      }
    })
    return transactions
  } catch (err) {
    LOGGER.error(formatSession(session), "Method: getTransactionsByOwnerId", err)
    throw new InternalError()
  }
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
): Promise<GetTransactionDetail> {
  try {
    const transaction = await getPrismaClient().transaction.findUnique({
      where: {
        id: transactionId,
        owner: session.user!.id,
        status: {
          not: TransactionStatus.QUOTE
        }
      },
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
        debitCurrency: true,
        cashIn: {
          select: {
            status: true,
            method: true,
            paymentLink: true,
            cashInReceiveAt: true
          }
        }
      }
    })
    if (!transaction) throw new ResourceNoFoundError("Resource no found.");
    return transaction
  } catch (err) {
    if ( err instanceof NBPError) throw err
    LOGGER.error(formatSession(session), "Method: getTransactionDetailByOwnerId", err)
    throw new InternalError()
  }
}