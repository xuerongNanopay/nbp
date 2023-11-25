import React from 'react'

import {
  Card, 
  CardHeader, 
  CardBody, 
  CardFooter,
  Link
} from "@nextui-org/react"

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
const testTransaction: NBPStransactionSummary= {
  id: '1',
  remiteeName: 'Xuerong Wu',
  created: '11/1/2023', // Or Date type
  status: 'Pending',
  nbpReference: 'NP000000000000000',
  sendAmount: "22.00 CAD",
  receiveAmount: "4520.34 PRK"
}

const testTransactions: NBPStransactionSummary[] = Array(5).map((_, idx): NBPStransactionSummary => {
  return {...testTransaction, id: idx.toString()}
})

export default function TransactionCard({className, maxContent, transactions}: Props) {
  return (
    <Card className={`text-black bg-[#f2f7f5]  border border-red-700 max-h-[350px] max-w-[1080px] ${!className ? '' : className}`}>
      <CardHeader className="font-semibold text-lg">Recent Transaction</CardHeader>
      <CardBody>
        <p>1111</p>
        <p>1111</p>
        <p>1111</p>
        <p>1111</p>
      </CardBody>
      <CardFooter>
        <Link href="/transactions" className="text-slate-600 text-lg font-semibold mx-auto">
          See More...
        </Link>
      </CardFooter>
    </Card>
  )
}

function TransactionItem(
  {transaction}: {transaction: ITransaction}
) : React.JSX.Element {
  return (
    <div className="">
  
    </div>
  )
}

function MobileTransactionItem(
  {transaction}: {transaction: ITransaction}
) : React.JSX.Element {
  return (
    <>
  
    </>
  )
} 
