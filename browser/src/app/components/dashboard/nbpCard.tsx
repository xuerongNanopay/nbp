'use client'
import {
  Card, 
  CardHeader, 
  CardBody, 
  CardFooter, 
  Image, 
  Button
} from "@nextui-org/react"

import { SendMoneyIcon } from "@/app/icons/SendMoneyIcon"


export default function NbpCard() {
  return (
    <Card className="text-black bg-[#f2f7f5] min-h-[200px] min-w-[300px] max-h-[350px] max-w-[400px]">
      <CardBody className="grid place-content-center">
        <h4 className="font-medium">
          Stress-Free Money Transfers to TODO
        </h4>
        <ul className="text-xs list-disc text-slate-600 list-inside mt-2">
          <li><span className=""> $0 fee transfers</span></li>
          <li>Competitive FX Rates</li>
          <li>Payouts through NBP Branch Network</li>
          <li>Transfer funds to 35+ Pakistani banks</li>
        </ul>
      </CardBody>
    </Card>
  )
}