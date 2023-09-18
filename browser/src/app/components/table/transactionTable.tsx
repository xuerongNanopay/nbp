'use client'
import React from 'react'

import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  ChipProps,
  Chip,
  Tooltip,
  Spinner
} from "@nextui-org/react";

import { EyeIcon } from '@/app/icons/EyeIcon'
import { formatRelativeDate } from '@/utils/dateUtil'
import { SendMoneyIcon } from '@/app/icons/SendMoneyIcon'
import transactions from '@/app/tests/dummyTransactions';

const statusColorMap: Record<string, ChipProps["color"]>  = {
  complete: "success",
  cancel: "danger",
  process: "secondary",
  awaitPayent: "warning",
};

const statusTextMap: Record<string, string>  = {
  complete: "SUCCESS",
  cancel: "CANCEL",
  process: "PROCESS",
  awaitPayent: "AWAIT PAYMENT",
};

const columns = [
  { name: 'Remittee', uid: 'remitee' },
  { name: 'Amount', uid: 'amount' },
  { name: 'Cost', uid: 'cost' },
  { name: 'Created', uid: 'created'},
  { name: 'Status', uid: 'status' },
  { name: 'Actions', uid: 'actions' }
]

const RemitteeCell = ({remiteeName, remitAccount, remitMethod}: ITransaction) => {
  return (
    <div className="flex flex-col">
      <p className="text-bold text-sm capitalize">{remiteeName}</p>
      <p className="text-tiny text-foreground-400">{remitMethod == 'cashPickup' ? 'Cash Pickup' : remitAccount}</p>
    </div>
  )
}

const AmountCell = ({amount}: ITransaction) => {
  return (
    <>
      <p>{amount}</p>
    </>
  )
}

const CostCell = ({cost}: ITransaction) => {
  return (
    <>
      <p>{cost}</p>
    </>
  )
}


const StatusCell = ({status}: ITransaction) => {
  return (
    <Chip className="capitalize" color={statusColorMap[status]} size="sm" variant="flat">
      {statusTextMap[status]}
    </Chip>
  )
}

const CreatedCell = ({created}: ITransaction) => {
  return (
    <>
      <p>{formatRelativeDate(created)}</p>
    </>
  )
}

const ActionsCell = (transaction: ITransaction) => {
  return (
    <>
      <p>Actions</p>
    </>
  )
}

export default function TransactionTable() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [page, setPage] = React.useState(1)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)

  const showDetailWrapper = (transactionId: string) => {
    return () => {
      alert("TODO: SHOW DETAIl: " + transactionId)
    }
  }
  const etransferLinkWrapper = (etransferLink: string) => {
    return () => {
      alert("TODO: Etransfer: " + etransferLink)
    }
  }
  const renderCell = React.useCallback((transaction: ITransaction, columnKey: React.Key) => {
    switch(columnKey) {
      case "remitee":
        return (
          <RemitteeCell {...transaction}/>
        )
      case "amount":
        return (
          <AmountCell {...transaction}/>
        )
      case "cost":
        return (
          <CostCell {...transaction}/>
        )
      case "created":
        return (
          <CreatedCell {...transaction}/>
        )
      case "status":
        return (
          <StatusCell {...transaction}/>
        )
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Details">
              <span 
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                onClick={showDetailWrapper(transaction.id)}
              >
                <EyeIcon/>
              </span>
            </Tooltip>
            <Tooltip content="Pay">
              <span 
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                onClick={etransferLinkWrapper(transaction.etransferLink)}
              >
                <SendMoneyIcon/>
              </span>
            </Tooltip>
          </div>
        )
      default:
        return null
    }
  }, [])

  return (
    <Table 
      aria-label="Transaction table"
      className="w-full max-w-4xl"
      isStriped={true}
      // removeWrapper
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.uid}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody 
        items={transactions}
        isLoading={isLoading}
        loadingContent={<Spinner label="Loading..." />}
      >
      {(item) => (
        <TableRow key={item.id}>
          {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
        </TableRow>
      )}
      </TableBody>
    </Table>
  )
}
