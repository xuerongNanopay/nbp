import { 
  assertActiveUser, 
  assertSession, 
  castAndValidateData
} from '@/lib/guard'
import { fetchSession } from '@/lib/session'
import { getTransactionsByOwnerId } from '@/lib/transaction'
import { UnauthenticateError } from '@/schema/error'
import { GetTransactionOptionValidator } from '@/schema/validator'
import { HttpERROR } from '@/types/http'
import { GetTransactionOption } from '@/types/transaction'
import { LOGGER, formatSession } from '@/utils/logUtil'
import { TransactionStatus } from '@prisma/client'

export async function GET(request: Request) {
  const session = await fetchSession()
  const { searchParams } = new URL(request.url)
  const fromStr = searchParams.get('from')
  const sizeStr = searchParams.get('size')
  const searchKey = searchParams.get("search")
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

    const transactions = await getTransactionsByOwnerId(session, getTransactionOption)

    return Response.json(transactions, {
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