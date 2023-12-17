import React from 'react'

import {
  Card, 
  CardHeader, 
  CardBody, 
  CardFooter,
  Link
} from "@nextui-org/react"

import { 
  RightArrow 
} from '@/icons/RightArrow'

import { formatRelativeDate } from '@/utils/dateUtil'
import { NBPTransactionSummary } from '@/type'

type Props = {
  maxContent?: number,
  className?: string,
  transactions?: NBPTransactionSummary[]
}
// ·

export default function TransactionCard({className, transactions}: Props) {
  const testTransaction: NBPTransactionSummary= {
    id: '1',
    sendName: 'vvvd dd',
    receiveName: 'Xuerong Wu',
    created: new Date(), // Or Date type
    status: 'Await for payment',
    nbpReference: 'NP000000000000000',
    sendAmount: "22.00 CAD",
    receiveAmount: "4520.34 PRK",
    summary: "aaa -> vvv | avvv -> ccc"
  }
  
  const testTransactions: NBPTransactionSummary[] = Array(10).fill(null).map((_, idx): NBPTransactionSummary => {
    return {...testTransaction, id: idx.toString()}
  })

  const renderTransactions = testTransactions
  return (
    <Card className={`text-black bg-[#f2f7f5] max-w-[1080px] ${!className ? '' : className}`}>
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
                    <Link href={`/transactions/${transaction.id}`} className="text-slate-900 block">
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
                    <Link href={`/transactions/${transaction.id}`} className="text-slate-900 block">
                      <MobileTransactionItem transaction={transaction}/>
                    </Link>
                  </div>
                )
              })
            }
          </CardBody>
          <CardFooter>
            <Link href="/transactions" className="text-slate-600 text-lg font-semibold mx-auto">
              See More...
            </Link>
          </CardFooter>
        </>
      }
    </Card>
  )
}

function TransactionItem(
  {transaction}: {transaction: NBPTransactionSummary}
) : React.JSX.Element {
  return (
    <div className="py-2">
      <div className="flex justify-between">
        <div>
          <div className="flex items-center">
            <RightArrow className="me-4"/>
            <div>
              <p className="font-semibold">Sent to {transaction.receiveName}</p>
              <p className="text-sm text-slate-600">{formatRelativeDate(transaction.created)} · {transaction.nbpReference} · {transaction.status}</p>
            </div>
          </div>
        </div>
        <div>
          <div className="flex items-center">
            <div>
              <p className="font-semibold">{transaction.receiveAmount}</p>
              <p className="text-sm">{transaction.sendAmount}</p>
            </div>
            <RightArrow className="ms-4"/>
          </div>
        </div>
      </div>
    </div>
  )
}

function MobileTransactionItem(
  {transaction}: {transaction: NBPTransactionSummary}
) : React.JSX.Element {
  return (
    <div className="flex justify-between items-center py-2">
      <div>
        <p className="font-semibold text-sm">Sent to {transaction.receiveName}</p>
        <p className="text-sm">Receive: {transaction.receiveAmount}</p>
        {/* <p className="text-sm">{transaction.sendAmount}</p> */}
        <p className="text-sm">Status: {transaction.status}</p>
        <p className="text-sm text-slate-600">Created: {formatRelativeDate(transaction.created)}</p>
      </div>
      <div>
        <RightArrow/>
      </div>
    </div>
  )
} 
