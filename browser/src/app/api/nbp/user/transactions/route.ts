import { 
  assertActiveUser, 
  assertSession, 
  castAndValidateData
} from '@/lib/guard'
import { fetchSession } from '@/lib/session'
import { countTransactions, getTransactionsByOwnerId } from '@/lib/transaction'
import { UnauthenticateError } from '@/schema/error'
import { GetTransactionOptionValidator } from '@/schema/validator'
import { HttpERROR, HttpGET, Many } from '@/types/http'
import { GetTransaction, GetTransactionOption, GetTransactions } from '@/types/transaction'
import { LOGGER, formatSession } from '@/utils/logUtil'
import { TransactionStatus } from '@prisma/client'

export async function GET(request: Request) {
  const session = await fetchSession()
  const { searchParams } = new URL(request.url)
  const fromStr = searchParams.get('from')
  const sizeStr = searchParams.get('size')
  const searchKey = searchParams.get("searchKey")
  const statuses = searchParams.get("statuses")

  try {
    if (!session || !assertSession(session)) throw new UnauthenticateError("Please Login")

    const options: GetTransactionOption = {}
    if ( !!fromStr && !isNaN(parseInt(fromStr)) ) {
      options.from = parseInt(fromStr)
    }
    if ( !!sizeStr && !isNaN(parseInt(sizeStr)) ) {
      options.size = parseInt(sizeStr)
    }
    if ( !!searchKey && searchKey.trim().length !== 0 ) {
      options.searchKey = searchKey.trim()
    }
    if ( !!statuses && statuses.trim().length !==0 ) {
      options.statuses = statuses.trim().split(",") as TransactionStatus[]
    }

    const getTransactionOption = await castAndValidateData(options, GetTransactionOptionValidator) as GetTransactionOption

    const opts: GetTransactionOption = {
      from: 0,
      size: 50,
      statuses: [
        TransactionStatus.INITIAL,
        TransactionStatus.PROCESS,
        TransactionStatus.REFUND,
        TransactionStatus.REFUND_IN_PROGRESS,
        TransactionStatus.CANCEL,
        TransactionStatus.REJECT,
        TransactionStatus.WAITING_FOR_PAYMENT
      ],
      searchKey: "",
      ...getTransactionOption
    }

    const transactionsPromise = await getTransactionsByOwnerId(session, opts)
    const countPromise = await countTransactions(session, opts)

    const [transactions, count] = await Promise.all([transactionsPromise, countPromise])

    const payload: Many<GetTransaction> = {
      meta: {
        query: {
          from: opts.from,
          size: opts.size,
          searchKey: opts.searchKey,
          statuses: opts.statuses
        },
        timestamp: new Date(),
        count
      },
      many: transactions
    }
    const res: HttpGET<GetTransactions> = {
      code: 200,
      message: 'Success!',
      payload
    }
    return Response.json(res, {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (err: any) {
    LOGGER.error(`${formatSession(session)}`, "API: transactions-GET", err)

    const errorResponse: HttpERROR = !err.errors ? {
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