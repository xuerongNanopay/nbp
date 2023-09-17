'use client'
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  ChipProps
} from "@nextui-org/react";
import { date } from "yup";

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

const transactions = [
  {
    id: '1',
    remitee: 'XXX XX',
    amount: '12.22 PKR',
    cost: '22.33 CAD',
    status: 'awaitPayment', //waitingForPayment, sending, complete
    created: new Date(),
    etransferLink: 'https://www.youtube.com',
    paymentMethod: 'etransfer'
  }
]

export default function TransactionTable() {
  return (
    <Table 
      aria-label="Transaction table"
      className="w-full max-w-4xl"
    >
      <TableHeader>
        <TableColumn>NAME</TableColumn>
        <TableColumn>ROLE</TableColumn>
        <TableColumn>STATUS</TableColumn>
      </TableHeader>
      <TableBody>
        <TableRow key="1">
          <TableCell>Tony Reichert</TableCell>
          <TableCell>CEO</TableCell>
          <TableCell>Active</TableCell>
        </TableRow>
        <TableRow key="2">
          <TableCell>Zoey Lang</TableCell>
          <TableCell>Technical Lead</TableCell>
          <TableCell>Paused</TableCell>
        </TableRow>
        <TableRow key="3">
          <TableCell>Jane Fisher</TableCell>
          <TableCell>Senior Developer</TableCell>
          <TableCell>Active</TableCell>
        </TableRow>
        <TableRow key="4">
          <TableCell>William Howard</TableCell>
          <TableCell>Community Manager</TableCell>
          <TableCell>Vacation</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}
