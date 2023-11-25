'use client'

import { useSearchParams } from "next/navigation"
import { TransferForm } from "@/components/form"

export default function TransferView() {
  const searhParams = useSearchParams()
  const from = searhParams.get('from') as string
  const to = searhParams.get('to') as string

  return (
    <>
      <div className="flex justify-center mt-4">
        <TransferForm sourceAccountId={from} destinationAccountId={to}/>
      </div>
    </>
  )
}
