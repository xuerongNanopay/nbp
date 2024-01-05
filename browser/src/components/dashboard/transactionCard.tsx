import React from 'react'

import {
  Card, 
  CardHeader, 
  CardBody, 
  CardFooter,
  Link,
  ChipProps,
  Chip
} from "@nextui-org/react"

import { 
  RightArrow 
} from '@/icons/RightArrow'

import { formatRelativeDate } from '@/utils/dateUtil'
import { GetTransaction } from '@/types/transaction'
import { TransactionStatus } from '@prisma/client'
import { currencyFormatter } from '@/utils/textUtil'

type Props = {
  transactions: GetTransaction[]
}

const STATUS_COLOR_MAP: Record<string, ChipProps["color"]> = {
  [TransactionStatus.INITIAL]: "secondary",
  [TransactionStatus.WAITING_FOR_PAYMENT]: "warning",
  [TransactionStatus.PROCESS]: "secondary",
  [TransactionStatus.REFUND_IN_PROGRESS]: "secondary",
  [TransactionStatus.REFUND]: "success",
  [TransactionStatus.CANCEL]: "danger",
  [TransactionStatus.REJECT]: "danger",
  [TransactionStatus.COMPLETE]: "success"
}

const STATUS_TEXT_MAP:  Record<string, string>  = {
  [TransactionStatus.INITIAL]: "Initial",
  [TransactionStatus.WAITING_FOR_PAYMENT]: "Await Payment",
  [TransactionStatus.PROCESS]: "Process",
  [TransactionStatus.REFUND_IN_PROGRESS]: "Refunding",
  [TransactionStatus.REFUND]: "Refund",
  [TransactionStatus.CANCEL]: "Cancel",
  [TransactionStatus.REJECT]: "Reject",
  [TransactionStatus.COMPLETE]: "Complete"
}

export default function TransactionCard({transactions}: Props) {

  const renderTransactions = transactions
  return (
    <Card className={`text-black bg-[#f2f7f5] max-w-[1080px]`}>
      <CardHeader className="font-semibold text-lg">Recent Transaction</CardHeader>
      {
        !renderTransactions || renderTransactions.length === 0 ?
        <>
          <CardFooter>
            <p className="text-slate-600 text-lg font-semibold mx-auto">Empty</p>
          </CardFooter>
        </>
        :
        <>
          <CardBody className="max-sm:hidden">
            {
              renderTransactions.slice(0,7).map((transaction) => {
                return (
                  <div key={transaction.id} className="border-b-1 border-slate-200 last:border-b-0">
                    <Link href={`/nbp/transactions/${transaction.id}`} className="text-slate-900 block">
                      <TransactionItem transaction={transaction}/>
                    </Link>
                  </div>
                )          
              })
            }
          </CardBody>
          <CardBody className="sm:hidden">
            {
              renderTransactions.slice(0,4).map((transaction) => {
                return (
                  <div key={transaction.id} className="border-b-1 border-slate-300 last:border-b-0">
                    <Link href={`/nbp/transactions/${transaction.id}`} className="text-slate-900 block">
                      <MobileTransactionItem transaction={transaction}/>
                    </Link>
                  </div>
                )
              })
            }
          </CardBody>
          <CardFooter>
            <Link href="/nbp/transactions" className="text-slate-600 text-lg font-semibold mx-auto">
              See More...
            </Link>
          </CardFooter>
        </>
      }
    </Card>
  )
}

function TransactionItem(
  {transaction}: {transaction: GetTransaction}
) : React.JSX.Element {
  return (
    <div className="py-2">
      <div className="flex justify-between">
        <div>
          <div className="flex items-center">
            <RightArrow className="me-4"/>
            <div>
              <p className="font-semibold">Sent to {transaction.destinationName}</p>
              <div className="text-sm text-slate-600">{formatRelativeDate(transaction.createdAt)} · <StatusChip transaction={transaction}/></div>
            </div>
          </div>
        </div>
        <div>
          <div className="flex items-center">
            <div className="flext justify-end">
              <p className="font-semibold text-end">{currencyFormatter(transaction.destinationAmount/100.0, transaction.destinationCurrency)}</p>
              <p className="text-sm text-end">{currencyFormatter(transaction.sourceAmount/100.0, transaction.sourceCurrency)}</p>
            </div>
            <RightArrow className="ms-4"/>
          </div>
        </div>
      </div>
    </div>
  )
}

function MobileTransactionItem(
  {transaction}: {transaction: GetTransaction}
) : React.JSX.Element {
  return (
    <div className="flex justify-between items-center py-2">
      <div className="flex flex-col gap-0">
        <p className="font-semibold text-sm">Sent to: {transaction.destinationName}</p>
        <p className="text-sm">Receive: {currencyFormatter(transaction.destinationAmount/100.0, transaction.destinationCurrency)}</p>
        {/* <p className="text-sm">{transaction.sendAmount}</p> */}
        <p className="text-sm text-slate-600 italic">Created: {formatRelativeDate(transaction.createdAt)}</p>
        <StatusChip transaction={transaction}/>
      </div>
      <div>
        <RightArrow/>
      </div>
    </div>
  )
} 

function StatusChip({transaction}: {transaction: GetTransaction}) {
  return (
    <Chip color={STATUS_COLOR_MAP[transaction.status]} size="sm" variant="flat">
      {STATUS_TEXT_MAP[transaction.status]}
    </Chip>
  )
}