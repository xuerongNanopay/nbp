'use client'
import React from "react"

import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  ChipProps
} from "@nextui-org/react";

const statusColorMap: Record<string, ChipProps["color"]>  = {
  complete: "success",
  cancel: "danger",
  process: "secondary",
  waitingPayment: "warning",
};

const columns = [
  { name: 'Remittee', uid: 'remitee' },
  { name: 'Amount', uid: 'amount' },
  { name: 'Cost', uid: 'cost' },
  { name: 'Created', uid: 'created'},
  { name: 'Actions', uid: 'actions' }
]

const transactions: ITransaction[] = [
  {
    id: '1',
    remiteeName: 'XXX XX',
    remitAccount: 'NBP(XXXX111)',
    remitMethod: 'bankAccount',
    amount: '12.22 PKR',
    cost: '22.33 CAD',
    status: 'awaitPayment', //waitingForPayment, sending, complete
    created: new Date(),
    etransferLink: 'https://www.youtube.com',
    paymentMethod: 'etransfer'
  }
]

const RemitteeCell = ({remiteeName, remitAccount, remitMethod}: ITransaction) => {
  return (
    <>
      <p>{remiteeName}</p>
    </>
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
    <>
      <p>{status}</p>
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
  const renderCell = React.useCallback((transaction: ITransaction, columnKey: React.Key) => {
    console.log(columnKey)
    // const cellValue = transaction[columnKey as keyof ITransaction];
    return <></>
  }, [])

  return (
    <Table 
      aria-label="Transaction table"
      className="w-full max-w-4xl"
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.uid}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={transactions}>
      {(item) => (
        <TableRow key={item.id}>
          {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
        </TableRow>
      )}
      </TableBody>
    </Table>
  )
}
