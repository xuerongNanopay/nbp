'use client'
import {
  Card, 
  CardHeader, 
  CardBody, 
  CardFooter, 
  Image, 
  Button,
  Link
} from "@nextui-org/react"

import { FiSend } from "react-icons/fi"

// import { SendMoneyIcon } from "@/icons/SendMoneyIcon"
import { CurrencyRate } from "@/types/currency"


export default function RateCard({className, rate}: {className?: string, rate: CurrencyRate | null}) {
  return (
    <Card className={`text-black bg-[#f2f7f5] min-h-[200px] max-h-[350px] max-w-[500px] ${!className ? '' : className}`}>
      <CardHeader>
        <h3 className="font-semibold">Current Rates</h3>
      </CardHeader>
      <CardBody className="font-medium grid place-content-center">
        <h4>
          {`🇨🇦 ${!rate ? '?' : '1.00'}  CAD \u2248 🇵🇰 ${!rate ? '?' : rate.value} PKR`}
        </h4>
      </CardBody>
      <CardFooter className="grid place-content-stretch">
        <Button href="/nbp/transfer" as={Link} color="primary" startContent={<FiSend/>}>
          Send Money
        </Button>
      </CardFooter>
    </Card>
  )
}
