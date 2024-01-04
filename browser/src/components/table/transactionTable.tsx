'use client'
import React, { useEffect } from 'react'
import { Selection } from '@nextui-org/react'
import useSWR from 'swr'

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
import { NBPTransactionSummary } from '@/type';
import { GetTransaction } from '@/types/transaction';
import { TransactionStatus } from '@prisma/client';


const STATUS_OPTIONS = [
  {id: TransactionStatus.INITIAL, name: TransactionStatus.INITIAL},
  {id: TransactionStatus.WAITING_FOR_PAYMENT, name: TransactionStatus.WAITING_FOR_PAYMENT},
  {id: TransactionStatus.PROCESS, name: TransactionStatus.PROCESS},
  {id: TransactionStatus.REFUND_IN_PROGRESS, name: TransactionStatus.REFUND_IN_PROGRESS},
  {id: TransactionStatus.REFUND, name: TransactionStatus.REFUND},
  {id: TransactionStatus.CANCEL, name: TransactionStatus.CANCEL},
  {id: TransactionStatus.COMPLETE, name: TransactionStatus.COMPLETE},
  {id: TransactionStatus.REJECT, name: TransactionStatus.REJECT}
]

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
  [TransactionStatus.INITIAL]: TransactionStatus.INITIAL,
  [TransactionStatus.WAITING_FOR_PAYMENT]: TransactionStatus.WAITING_FOR_PAYMENT,
  [TransactionStatus.PROCESS]: TransactionStatus.PROCESS,
  [TransactionStatus.REFUND_IN_PROGRESS]: TransactionStatus.REFUND_IN_PROGRESS,
  [TransactionStatus.REFUND]: TransactionStatus.REFUND,
  [TransactionStatus.CANCEL]: TransactionStatus.CANCEL,
  [TransactionStatus.REJECT]: TransactionStatus.REJECT,
  [TransactionStatus.COMPLETE]: "success"
}

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

enum COLUME_TYPE {
  RECEIVER='receiver',
  RECEIVER_AMOUNT='amount',
  STATUS='status',
  CREATED_AT='createdAt',
  ACTIONS='actions',
  ALL='All'
}

const COLUME_MAP = {
  [COLUME_TYPE.RECEIVER]: {
    name: 'Receiver',
    headerCss: 'max-sm:hidden',
    cellCss: 'max-sm:hidden'
  },
  [COLUME_TYPE.RECEIVER_AMOUNT]: {
    name: 'Amount',
    headerCss: 'max-sm:hidden',
    cellCss: 'max-sm:hidden'
  },
  [COLUME_TYPE.STATUS]: {
    name: 'Status',
    headerCss: 'sm:hidden',
    cellCss: 'sm:hidden'
  },
  [COLUME_TYPE.CREATED_AT]: {
    name: 'Date',
    headerCss: 'max-sm:hidden',
    cellCss: 'max-sm:hidden'
  },
  [COLUME_TYPE.ALL]: {
    name: 'Transactions',
    headerCss: 'max-sm:hidden',
    cellCss: 'max-sm:hidden'
  },
  [COLUME_TYPE.ACTIONS]: {
    name: 'Actions',
    headerCss: 'max-sm:hidden',
    cellCss: 'max-sm:hidden'
  }
}

const ReceiverCell = (transaction: GetTransaction) => {
  return (
    <>
      <p>{transaction.destinationName}</p>
    </>
  )
}
const ReceiverAmountCell = (transaction: GetTransaction) => {
  return (
    <>
      <p>{transaction.destinationAmount/100.0} {transaction.destinationCurrency}</p>
    </>
  )
}
const StatusCell = ({status}: GetTransaction) => {
  return (
    <Chip className="capitalize" color={statusColorMap[status]} size="sm" variant="flat">
      {STATUS_TEXT_MAP[status]}
    </Chip>
  )
}
const DateCell = ({createdAt}: GetTransaction) => {
  return (
    <p>{formatRelativeDate(createdAt)}</p>
  )
}
const AllCell = (transaction: GetTransaction) => {
  return (
    <div>
      TODO
    </div>
  )
}

const ActionsCell = (transaction: GetTransaction) => {
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
      { 
        // transaction.status === 'awaitPayent' &&
        //   <Link href={'/transactions/' + transaction.id}>
        //     <Tooltip content="Pay">
        //       <span 
        //         className="text-lg text-default-400 cursor-pointer active:opacity-50"
        //       >
        //         💵
        //         {/* <SendMoneyIcon/> */}
        //       </span>
        //     </Tooltip>
        //   </Link>
      }
  </div>
  )
}

const Summary = ({summary}: NBPTransactionSummary) => {
  return (
    <p>{summary}</p>
  )
}

const StatusCelll = ({status}: NBPTransactionSummary) => {
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

const ActionsCelll = (transaction: NBPTransactionSummary) => {
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
      { 
        // transaction.status === 'awaitPayent' &&
        //   <Link href={'/transactions/' + transaction.id}>
        //     <Tooltip content="Pay">
        //       <span 
        //         className="text-lg text-default-400 cursor-pointer active:opacity-50"
        //       >
        //         💵
        //         {/* <SendMoneyIcon/> */}
        //       </span>
        //     </Tooltip>
        //   </Link>
      }
  </div>
  )
}

//FOR NOW, load all transactions and doing the fileter in frontEnd.
export default function TransactionTable({className, transactions}: {className?: string, transactions: NBPTransactionSummary[]}) {
  const [searchValue, setSearchValue] = React.useState('')
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
          <StatusCelll {...transaction}/>
        )
      case "receiveAmount":
        return (
          <AmountCell {...transaction}/>
        )
      case "actions":
        return (
          <ActionsCelll {...transaction}/>
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
            className="w-full sm:max-w-[44%]"
            placeholder="Search by Receiver..."
            value={searchValue}
            size='sm'
            onValueChange={onSearchValueChange}
            endContent={
              <Button
                isIconOnly
                variant="light"
                onClick={() => console.log('Search button click')}
              >
                🔍
              </Button>
            }
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
                {STATUS_OPTIONS.map((status) => (
                  <DropdownItem key={status.id} className="capitalize">
                    {status.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button 
              color="primary"
              endContent={<PlusIcon />}
              href="/nbp/transfer"
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
