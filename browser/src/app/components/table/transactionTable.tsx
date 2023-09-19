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
  Pagination
} from "@nextui-org/react";

import { EyeIcon } from '@/app/icons/EyeIcon'
import { formatRelativeDate } from '@/utils/dateUtil'
import { SendMoneyIcon } from '@/app/icons/SendMoneyIcon'
import transactions from '@/app/tests/dummyTransactions'
import { SearchIcon } from '@/app/icons/SearchIcon'
import { PlusIcon } from '@/app/icons/PlusIcon'
import { ChevronDownIcon } from '@/app/icons/ChevronDownIcon'

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
}

const columns = [
  { name: 'Remittee', uid: 'remitee' },
  { name: 'Receive', uid: 'receiveAmount' },
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

const AmountCell = ({receiveAmount}: ITransaction) => {
  return (
    <>
      <p>{receiveAmount}</p>
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

const ActionsCell = (transaction: ITransaction) => {
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
      { transaction.status === 'awaitPayent' ?
          <Tooltip content="Pay">
            <span 
              className="text-lg text-default-400 cursor-pointer active:opacity-50"
              onClick={etransferLinkWrapper(transaction.etransferLink)}
            >
              <SendMoneyIcon/>
            </span>
          </Tooltip>
        : <></>
      }
  </div>
  )
}

//FOR NOW, load all transactions and doing the fileter in frontEnd.
export default function TransactionTable() {
  const [searchValue, setSearchValue] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false)
  const [page, setPage] = React.useState(1)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [statusFilter, setStatusFilter] = React.useState<Selection>('all')

  const renderCell = React.useCallback((transaction: ITransaction, columnKey: React.Key) => {
    switch(columnKey) {
      case "remitee":
        return (
          <RemitteeCell {...transaction}/>
        )
      case "receiveAmount":
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
        transaction.remiteeName.toLowerCase().includes(searchValue.toLowerCase()),
      );
    }
    if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
      filteredTransactions = filteredTransactions.filter((transaction) =>
        Array.from(statusFilter).includes(transaction.status),
      );
    }

    return filteredTransactions;
  }, [transactions, searchValue, statusFilter])

  const pages = Math.ceil(filteredTransactions.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredTransactions.slice(start, end)
  }, [page, filteredTransactions, rowsPerPage])

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages])

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page])

  const onRowsPerPageChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, [])

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-start sm:flex-row justify-between gap-3 sm:items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by remitee..."
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
            <Button color="primary" endContent={<PlusIcon />}>
              Transfer
            </Button>
          </div>
        </div>
        <div className="flex flex-col items-start sm:flex-row justify-between sm:items-center">
          <span className="text-default-400 text-small">Total {filteredTransactions.length} transactions</span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
            </select>
          </label>
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
      className="w-full max-w-4xl"
      isStriped={true}
      topContent={topContent}
      isHeaderSticky
      // topContentPlacement="outside"
      // removeWrapper
      bottomContent={bottomContent}
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.uid}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody 
        items={items}
        // isLoading={isLoading}
        // loadingContent={<Spinner label="Loading..." />}
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
