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

import { SendMoneyIcon } from "@/icons/SendMoneyIcon"


export default function RateCard({className, rate}: {className?: string, rate: string}) {
  return (
    <Card className={`text-black bg-[#f2f7f5] min-h-[200px] max-h-[350px] max-w-[500px] ${!className ? '' : className}`}>
      <CardHeader>
        <h3 className="font-semibold">Current Rates</h3>
      </CardHeader>
      <CardBody className="font-medium grid place-content-center">
        <h4>
          🇨🇦 1.00 CAD = 🇵🇰 205.47 PKR
        </h4>
      </CardBody>
      <CardFooter className="grid place-content-stretch">
        <Button href="/transfer" as={Link} color="primary" startContent={<SendMoneyIcon />}>
          Send Money
        </Button>
      </CardFooter>
    </Card>
  )
}
