import React from 'react'

import {
  Card, 
  CardHeader, 
  CardBody, 
  CardFooter,
  Link
} from "@nextui-org/react"

type Props = {
  maxContent?: number,
  className: string,
  transactions?: ITransaction[]
}
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
