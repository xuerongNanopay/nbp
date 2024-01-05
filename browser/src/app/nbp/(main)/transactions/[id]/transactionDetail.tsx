'use client'

import {
  Button,
  Link,
  Breadcrumbs,
  BreadcrumbItem,
  ChipProps,
  Chip
} from '@nextui-org/react'

import { GetTransaction, GetTransactionDetail } from "@/types/transaction"
import { TransactionStatus } from '@prisma/client'
import { currencyFormatter } from '@/utils/textUtil'

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

export function TransactionDetail({transaction}: {transaction: GetTransactionDetail}) {

  return (
    <div className="max-w-4xl mx-auto">
      <Breadcrumbs className="mb-4" color="primary">
        <BreadcrumbItem href='/nbp/transactions'>transactions</BreadcrumbItem>
        <BreadcrumbItem href='#'>{transaction.id}</BreadcrumbItem>
      </Breadcrumbs>
      <h1 className="font-semibold text-ellipsis sm:font-bold sm:text-3xl mb-4">
        {transaction.destinationName} 💰 {currencyFormatter(transaction.destinationAmount, transaction.destinationCurrency)}
      </h1>
      {/* Interact */}
      <div className="flex">
        <div className="flex-none w-1 bg-yellow-600 rounded-s-medium"></div>
        <div className="flex-auto bg-yellow-200 py-2 px-2 md:px-4 rounded-e-medium">
          <h4 className="font-semibold mb-1 sm:mb-2">Attention:</h4>
          <p className="text-sm mb-1 sm:mb-2">This transaction is on hold while we wait to receive your Interac e-Transfer. Please click the button below to complete the transaction. If you have recently completed the interac request, please wait for the transaction to be updated.</p>
          <Button 
            href={"https://www.google.com"}
            as={Link}
            color="primary"
            target="_blank"
          >
            Complete Transacton
          </Button>
        </div>
      </div>
      {/* Genera Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-2 mt-2 sm:mt-4 border border-slate-200 rounded-md">
        <div>
          <h5 className="font-semibold">Created</h5>
          <p className="text-sm text-slate-600">{transaction.createdAt.toISOString()}</p>
        </div>
        {/* <div>
          <h5 className="font-semibold">Reference #</h5>
          <p className="text-sm text-slate-600">{transactionDetail.nbpReference}</p>
        </div> */}
        <div>
          <h5 className="font-semibold">Status</h5>
          <StatusChip status={transaction.status}/>
        </div>
      </div>
      {/* Receiver Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2 mt-2 sm:mt-4 border border-slate-200 rounded-md">
        <div>
          <h5 className="font-semibold">To</h5>
          <p className="text-sm text-slate-600">{transaction.destinationName}</p>
        </div>
        <div>
          <h5 className="font-semibold">Destination Account</h5>
          <p className="text-sm text-slate-600">{currencyFormatter(transaction.destinationAmount/100.0, transaction.destinationCurrency)}</p>
        </div>
      </div>
            {/* Cost Info */}
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-2 p-2 mt-2 sm:mt-4 border border-slate-200 rounded-md">
        <div>
          <h5 className="font-semibold">Source Amount</h5>
          <p className="text-sm text-slate-600">{transactionDetail.sendAmount}</p>
        </div>
        <div>
          <h5 className="font-semibold">FX Rate</h5>
          <p className="text-sm text-slate-600">{transactionDetail.fxRate}</p>
        </div>
        <div>
          <h5 className="font-semibold">Fee</h5>
          <p className="text-sm text-slate-600">{transactionDetail.fee}</p>
        </div>
        <div>
          <h5 className="font-semibold">Destination Amount</h5>
          <p className="text-sm text-slate-600">{transactionDetail.receiveAmount}</p>
        </div>
      </div> */}
    </div>
  )
}

function StatusChip({status}: {status: TransactionStatus}) {
  return (
    <Chip color={STATUS_COLOR_MAP[status]} size="sm" variant="flat">
      {STATUS_TEXT_MAP[status]}
    </Chip>
  )
}