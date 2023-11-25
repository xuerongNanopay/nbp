import {
  Card, 
  CardBody
} from "@nextui-org/react"

export default function NbpCard({className}: {className?: string}) {
  return (
    <Card className={`text-black bg-[#f2f7f5] min-h-[200px] max-h-[350px] max-w-[500px] ${!className ? '' : className}`}>
      <CardBody className="grid place-content-center">
        <h4 className="font-bold text-xl mb-2">
          Stress-Free Money Transfers to TODO
        </h4>
        <ul className="text-xs list-disc text-slate-600 list-inside mt-2">
          <li><span className="font-semibold"> $0 fee transfers</span></li>
          <li>Competitive FX Rates</li>
          <li>Payouts through NBP Branch Network</li>
          <li>Transfer funds to 35+ Pakistani banks</li>
        </ul>
      </CardBody>
    </Card>
  )
}