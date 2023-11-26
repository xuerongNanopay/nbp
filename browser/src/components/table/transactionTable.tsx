'use client'
import React, { useEffect } from 'react'
import { Selection } from '@nextui-org/react';

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
  Spinner,
  Input,
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
  Pagination,
  Link
} from "@nextui-org/react";

import { formatRelativeDate } from '@/utils/dateUtil'

import { EyeIcon } from '@/icons/EyeIcon'
import { SendMoneyIcon } from '@/icons/SendMoneyIcon'
import { SearchIcon } from '@/icons/SearchIcon'
import { PlusIcon } from '@/icons/PlusIcon'
import { ChevronDownIcon } from '@/icons/ChevronDownIcon'

const statusOptions = [
  {name: "SUCCESS", uid: "complete"},
  {name: "CANCEL", uid: "cancel"},
  {name: "PROCESS", uid: "process"},
  {name: "AWAIT PAYMENT", uid: "awaitPayent"}
]

const statusColorMap: Record<string, ChipProps["color"]>  = {
  complete: "success",
  cancel: "danger",
  process: "secondary",
  awaitPayent: "warning",
}

const statusTextMap: Record<string, string>  = {
  complete: "SUCCESS",
  cancel: "CANCEL",
  process: "PROCESS",
  awaitPayent: "AWAIT PAYMENT",
  // refund: "REFUND IN PROGRESS"
}

const columns = [
  { id: 'summary', name: 'Summary' },
  { id: 'created', name: 'Date' },
  { id: 'status', name: 'Status' },
  { id: 'receiveAmount', name: 'Amount' },
  { id: 'actions', name: 'Actions'}
]

const Summary = ({summary}: NBPTransactionSummary) => {
  return (
    <p>{summary}</p>
  )
}

const StatusCell = ({status}: NBPTransactionSummary) => {
  return (
    <Chip className="capitalize" color={statusColorMap[status]} size="sm" variant="flat">
      {statusTextMap[status]}
    </Chip>
  )
}

const CreatedCell = ({created}: NBPTransactionSummary) => {
  return (
    <>
      <p>{formatRelativeDate(created)}</p>
    </>
  )
}

const AmountCell = ({receiveAmount}: NBPTransactionSummary) => {
  return (
    <p>{receiveAmount}</p>
  )
}

const ActionsCell = (transaction: NBPTransactionSummary) => {
  return (
    <div className="relative flex items-center gap-2">
      <Link href={'/transactions/' + transaction.id}>
        <Tooltip content="Details">
          <span 
            className="text-lg text-default-400 cursor-pointer active:opacity-50"
          >
            <EyeIcon/>
          </span>
        </Tooltip>     
      </Link>
      { transaction.status === 'awaitPayent' &&
        <Link href={'/transactions/' + transaction.id}>
          <Tooltip content="Pay">
            <span 
              className="text-lg text-default-400 cursor-pointer active:opacity-50"
            >
              <SendMoneyIcon/>
            </span>
          </Tooltip>
        </Link>
      }
  </div>
  )
}

//FOR NOW, load all transactions and doing the fileter in frontEnd.
export default function TransactionTable({className, transactions}: {className?: string, transactions: NBPTransactionSummary[]}) {
  const [searchValue, setSearchValue] = React.useState('');
  const [page, setPage] = React.useState(1)
  const [rowsPerPage, setRowsPerPage] = React.useState(13)
  const [statusFilter, setStatusFilter] = React.useState<Selection>('all')

  const renderCell = React.useCallback((transaction: NBPTransactionSummary, columnKey: React.Key) => {
    switch(columnKey) {
      case "summary":
        return (
          <Summary {...transaction}/>
        )
      case "created":
        return (
          <CreatedCell {...transaction}/>
        )
      case "status":
        return (
          <StatusCell {...transaction}/>
        )
      case "receiveAmount":
        return (
          <AmountCell {...transaction}/>
        )
      case "actions":
        return (
          <ActionsCell {...transaction}/>
        )
      default:
        return null
    }
  }, [])

  const onSearchValueChange = React.useCallback((value?: string) => {
    if (value) {
      setSearchValue(value);
      setPage(1);
    } else {
      setSearchValue("");
    }
  }, []);

  const onClear = React.useCallback(()=>{
    setSearchValue("")
    setPage(1)
  },[])

  //TODO: Improve to reduce the network load.
  const filteredTransactions = React.useMemo(() => {
    let filteredTransactions = [...transactions];

    if (Boolean(searchValue)) {
      filteredTransactions = filteredTransactions.filter((transaction) =>
        transaction.summary.toLowerCase().includes(searchValue.toLowerCase()),
      );
    }
    if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
      filteredTransactions = filteredTransactions.filter((transaction) =>
        Array.from(statusFilter).includes(transaction.status),
      );
    }

    return filteredTransactions;
  }, [searchValue, statusFilter])

  const pages = Math.ceil(filteredTransactions.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredTransactions.slice(start, end)
  }, [page, filteredTransactions, rowsPerPage])

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4 sticky top-0">
        <div className="flex flex-col items-start sm:flex-row justify-between gap-3 sm:items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by summary..."
            startContent={<SearchIcon />}
            value={searchValue}
            onClear={() => onClear()}
            onValueChange={onSearchValueChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger>
                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {status.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button 
              color="primary"
              endContent={<PlusIcon />}
              href="/transfer"
              as={Link}
            >              
              Transfer
            </Button>
          </div>
        </div>
        <div className="flex flex-col items-start sm:flex-row justify-between sm:items-center">
          <span className="text-default-400 text-small">Total {filteredTransactions.length} transactions</span>
        </div>
      </div>
    )
  },[
    searchValue,
    onSearchValueChange,
    statusFilter,
    setStatusFilter,
    onClear,
    filteredTransactions.length
  ])

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-center items-center">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
      </div>
    );
  }, [page, pages]);

  return (
    <Table 
      aria-label="Transaction table"
      isStriped={true}
      topContent={topContent}
      // hideHeader={true}
      isHeaderSticky
      // topContentPlacement="outside"
      // removeWrapper
      bottomContent={bottomContent}
      className={`w-full max-w-5xl ${className}`}
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.id}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody 
        items={items}
        emptyContent={"No rows to display."}
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
