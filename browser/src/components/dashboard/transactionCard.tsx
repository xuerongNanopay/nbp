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

type NBPStransactionSummary = {
  id: string,
  remiteeName: string,
  created: string, // Or Date type
  status: string,
  nbpReference: string,
  sendAmount: string,
  receiveAmount: string
}

type Props = {
  maxContent?: number,
  className?: string,
  transactions?: NBPStransactionSummary[]
}
// ·

export default function TransactionCard({className, maxContent, transactions}: Props) {
  const testTransaction: NBPStransactionSummary= {
    id: '1',
    remiteeName: 'Xuerong Wu',
    created: '11/1/2023', // Or Date type
    status: 'Await for payment',
    nbpReference: 'NP000000000000000',
    sendAmount: "22.00 CAD",
    receiveAmount: "4520.34 PRK"
  }
  
  const testTransactions: NBPStransactionSummary[] = Array(5).fill(null).map((_, idx): NBPStransactionSummary => {
    return {...testTransaction, id: idx.toString()}
  })

  return (
    <Card className={`text-black bg-[#f2f7f5] max-w-[1080px] ${!className ? '' : className}`}>
      <CardHeader className="font-semibold text-lg">Recent Transaction</CardHeader>
      {
        !testTransactions || testTransactions.length === 0 ?
        <>
          <CardFooter>
            <p className="text-slate-600 text-lg font-semibold mx-auto">Empty</p>
          </CardFooter>
        </>
        :
        <>
          <CardBody className="max-sm:hidden">
            {
              testTransactions.map((transaction) => {
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
              testTransactions.map((transaction) => {
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
  {transaction}: {transaction: NBPStransactionSummary}
) : React.JSX.Element {
  return (
    <div className="py-2">
      <div className="flex justify-between">
        <div>
          <div className="flex items-center">
            <RightArrow className="me-4"/>
            <div>
              <p className="font-semibold">Sent to {transaction.remiteeName}</p>
              <p className="text-sm text-slate-600">{transaction.created} · {transaction.nbpReference} · {transaction.status}</p>
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
  {transaction}: {transaction: NBPStransactionSummary}
) : React.JSX.Element {
  return (
    <div className="">
      <p>{transaction.id}</p>
    </div>
  )
} 
