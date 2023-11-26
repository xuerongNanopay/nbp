'use client'
import React, { useEffect } from 'react'
import { Selection, user } from '@nextui-org/react';

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
  Input,
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
  Pagination,
  Link
} from "@nextui-org/react"

import { formatRelativeDate } from '@/utils/dateUtil'

import { EyeIcon } from '@/icons/EyeIcon'
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
  { id: 'transactionSummary', name: 'Transaction SUmmary' }
]

const StatusCell = ({status}: {status: string}) => {
  return (
    <Chip className="capitalize" color={statusColorMap[status]} size="sm" variant="flat">
      {statusTextMap[status]}
    </Chip>
  )
}

const TransactionSummaryCell = (transaction: NBPTransactionSummary) => {
  return (
    <div className="flex justify-between items-center">
      <div className="ms-2">
        <h4>{transaction.summary}</h4>
        <p className="text-slate-400 my-1">{formatRelativeDate(transaction.created)}</p>
        <StatusCell status={transaction.status}/>
      </div>
      <Link href={'/transactions/' + transaction.id} className="me-2">
        <Tooltip content="Details">
          <span 
            className="text-lg text-default-400 cursor-pointer active:opacity-50"
          >
            <EyeIcon/>
          </span>
        </Tooltip>     
      </Link>
    </div>
  )
}

export default function MobileTransactionTable({className, transactions}: {className?: string, transactions: NBPTransactionSummary[]}) {
  const [searchValue, setSearchValue] = React.useState('');
  const [page, setPage] = React.useState(1)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const [statusFilter, setStatusFilter] = React.useState<Selection>('all')

  const renderCell = React.useCallback((transaction: NBPTransactionSummary, columnKey: React.Key) => {
    switch(columnKey) {
      case "transactionSummary":
        return (
          <TransactionSummaryCell {...transaction}/>
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
      <div className="flex flex-col gap-4">
        <div className="sticky top-0 flex flex-col items-start sm:flex-row justify-between gap-3 sm:items-end">
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
      hideHeader={true}
      isHeaderSticky
      topContentPlacement="outside"
      removeWrapper
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