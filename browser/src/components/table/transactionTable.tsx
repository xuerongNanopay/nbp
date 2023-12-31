'use client'
import React, { useEffect } from 'react'
import { Selection } from '@nextui-org/react'

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
  Link
} from "@nextui-org/react";

import { formatRelativeDate } from '@/utils/dateUtil'

import { FiSend } from "react-icons/fi"
import { EyeIcon } from '@/icons/EyeIcon'
import { ChevronDownIcon } from '@/icons/ChevronDownIcon'
import { 
  GetTransaction, 
  GetTransactionOption, 
  GetTransactions 
} from '@/types/transaction';
import { TransactionStatus } from '@prisma/client'
import { HttpGET } from '@/types/http';
import { CONSOLE_ALERT } from '@/utils/alertUtil';
import { useToastAlert } from '@/hook/useToastAlert';
import { currencyFormatter } from '@/utils/textUtil';

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

const STATUS_OPTIONS = Object.keys(STATUS_TEXT_MAP)

const statusOptions = [
  {name: "SUCCESS", uid: "complete"},
  {name: "CANCEL", uid: "cancel"},
  {name: "PROCESS", uid: "process"},
  {name: "AWAIT PAYMENT", uid: "awaitPayent"}
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
    headerCss: 'max-sm:hidden',
    cellCss: 'max-sm:hidden'
  },
  [COLUME_TYPE.CREATED_AT]: {
    name: 'Date',
    headerCss: 'max-sm:hidden',
    cellCss: 'max-sm:hidden'
  },
  [COLUME_TYPE.ALL]: {
    name: 'Transactions',
    headerCss: 'sm:hidden',
    cellCss: 'sm:hidden'
  },
  [COLUME_TYPE.ACTIONS]: {
    name: 'Actions',
    headerCss: 'max-sm:hidden',
    cellCss: 'max-sm:hidden'
  }
}
const COLUMES = Object.keys(COLUME_MAP).map(k => ({id: k}))


const ReceiverCell = ({transaction}: {transaction: GetTransaction}) => {
  return (
    <>
      <p>{transaction.destinationName.length < 20 ? transaction.destinationName : transaction.destinationName.split(' ')[0]}</p>
    </>
  )
}
const ReceiverAmountCell = ({transaction}: {transaction: GetTransaction}) => {
  return (
    <>
      <p>{currencyFormatter(transaction.destinationAmount/100.0, transaction.destinationCurrency)}</p>
    </>
  )
}
const StatusCell = ({transaction}: {transaction: GetTransaction}) => {
  return (
    <Chip color={STATUS_COLOR_MAP[transaction.status]} size="md" variant="flat">
      {STATUS_TEXT_MAP[transaction.status]}
    </Chip>
  )
}
const DateCell = ({transaction}: {transaction: GetTransaction}) => {
  return (
    <p>{formatRelativeDate(transaction.createdAt)}</p>
  )
}
const AllCell = ({transaction}: {transaction: GetTransaction}) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex flex-col gap-1">
        <p>{transaction.destinationName}</p>
        <p className="italic text-slate-600">{currencyFormatter(transaction.destinationAmount/100.0, transaction.destinationCurrency)}</p>
        <p className="italic text-slate-600">{formatRelativeDate(transaction.createdAt)}</p>
        <Chip color={STATUS_COLOR_MAP[transaction.status]} size="sm" variant="flat">
          {STATUS_TEXT_MAP[transaction.status]}
        </Chip>
      </div>
      <div>
        <Link href={`/nbp/transactions/${transaction.id}`}>
          <Tooltip content="Details">
            <span 
              className="text-lg text-default-400 cursor-pointer active:opacity-50"
            >
              <EyeIcon/>
            </span>
          </Tooltip>     
        </Link>
      </div>
    </div>
  )
}

const ActionsCell = ({transaction}: {transaction: GetTransaction}) => {
  return (
    <div className="relative flex items-center gap-2">
      <Link href={'/nbp/transactions/' + transaction.id}>
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

export default function TransactionTable() {
  const alert = useToastAlert() ?? CONSOLE_ALERT
  const [searchValue, setSearchValue] = React.useState('')
  const [_searchValue, _setSearchValue] = React.useState('')
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(15)
  const [statusFilter, setStatusFilter] = React.useState<Selection>(new Set(STATUS_OPTIONS))
  const [transactions, setTransactions] = React.useState<GetTransactions>([])
  const [transactionCount, setTransactionCount] = React.useState<number>(0)
  const [isTransactionsLoading, setIsTransactionLoading] = React.useState(true)

  const renderCell = React.useCallback((transaction: GetTransaction, columnKey: React.Key) => {
    switch(columnKey) {
      case COLUME_TYPE.RECEIVER:
        return (
          <ReceiverCell transaction={transaction}/>
        )
      case COLUME_TYPE.RECEIVER_AMOUNT:
        return (
          <ReceiverAmountCell transaction={transaction}/>
        )
      case COLUME_TYPE.STATUS:
        return (
          <StatusCell transaction={transaction}/>
        )
      case COLUME_TYPE.CREATED_AT:
        return (
          <DateCell transaction={transaction}/>
        )
      case COLUME_TYPE.ACTIONS:
        return (
          <ActionsCell transaction={transaction}/>
        )
      case COLUME_TYPE.ALL:
        return (
          <AllCell transaction={transaction}/>
        )
      default:
        return null
    }
  }, [])

  useEffect(() => {
    let controller = new AbortController()
    const loadTransaction = async () => {
      setIsTransactionLoading(true)
      try {
        const options: GetTransactionOption = {
          from: page * rowsPerPage,
          size: rowsPerPage,
          searchKey: !_searchValue.trim() ? "" : _searchValue.trim(),
          statuses: Array.from(statusFilter) as TransactionStatus[]
        }
        const response = await fetchTransactions({controller, options})
        const responsePayload = await response.json() as HttpGET<GetTransactions>

        if ( responsePayload.code >> 7 === 1 ) {
          setTransactions(responsePayload.payload.many)
          setTransactionCount(responsePayload.payload.meta.count)
        } else {
          alert.error(responsePayload.message)
        }
        setIsTransactionLoading(false)
      } catch ( err ) {
        setIsTransactionLoading(false)
        console.error(err)
      }
    }
    loadTransaction()
    //INVESTIGATE: cause typeError: Response body object should not be disturbed or locked on server.
    //             when using POST
    return () => controller.abort()
    // return () => {}
  }, [statusFilter, page, _searchValue])

  const fetchTransactions = React.useCallback(({options, controller}: {options?: GetTransactionOption, controller?: AbortController}): Promise<Response> => {
    const urlParams = new URLSearchParams()
    if ( !!options && !!options.from ) urlParams.set('from', `${options.from}`)
    if ( !!options && !!options.size ) urlParams.set('size', `${options.size}`)
    if ( !!options && !!options.searchKey ) urlParams.set('searchKey', `${options.searchKey}`)
    if ( !!options && !!options.statuses && options.statuses.length > 0)
      urlParams.set('statuses', `${options.statuses.join(',')}`)


    return fetch(`/api/nbp/user/transactions?${urlParams}`, {
      headers: {
        'Content-Type': 'application/json'
      },
      signal: controller?.signal
    })
  }, [])

  const onSearchValueChange = React.useCallback((value?: string) => {
    if (value) {
      setSearchValue(value)
    } else {
      setSearchValue("")
    }
  }, []);

  const onClear = React.useCallback(()=>{
    _setSearchValue('')
    setPage(0)
  },[])

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4 sticky top-0">
        <div className="flex flex-col items-center sm:flex-row justify-between gap-3 max-sm:items-end">
          <div className="flex w-full sm:max-w-[50%] items-center gap-1">
            <Input
              // className="w-full"
              placeholder="Search by Receiver..."
              value={searchValue}
              size='sm'
              isClearable
              onClear={onClear}
              onValueChange={onSearchValueChange}
              // endContent={
              //   <Button
              //     isIconOnly
              //     variant="light"
              //     onClick={() => console.log('Search button click')}
              //   >
              //     🔍
              //   </Button>
              // }
            />
            <Button
              isIconOnly
              variant="light"
              onClick={() => {
                setPage(0)
                _setSearchValue(searchValue)
              }}
            >
              🔍
            </Button>
          </div>
          <div className="max-sm:flex justify-between items-center max-sm:w-full">
            <p className="text-default-400 text-small sm:hidden">{`Total: ${transactionCount}`}</p>
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
                  onSelectionChange={(e) => {
                    setPage(0)
                    setStatusFilter(e)
                  }}
                >
                  {STATUS_OPTIONS.map((status) => (
                    <DropdownItem key={status}>
                      {STATUS_TEXT_MAP[status]}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
              <Button
                className="max-sm:hidden"
                color="primary"
                endContent={<FiSend/>}
                href="/nbp/transfer"
                as={Link}
              >              
                Transfer
              </Button>
              <Button
                isIconOnly
                className="sm:hidden"
                color="primary"
                endContent={<FiSend/>}
                href="/nbp/transfer"
                as={Link}
              >              
              </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start sm:flex-row justify-between sm:items-center max-sm:hidden">
          <span className="text-default-400 text-small">{`Total ${transactionCount} Transactions`}</span>
        </div>
      </div>
    )
  },[
    transactionCount,
    searchValue,
    onSearchValueChange,
    statusFilter,
    setStatusFilter
  ])

  const bottomContent = React.useMemo(() => {
    return (
      <div className="flex justify-end gap-2">
        <Button 
          color="primary"
          variant="ghost"
          isDisabled={page<=0}
          isLoading={isTransactionsLoading}
          onClick={() => {
            setPage(page => page-1)
          }}
        >Previous</Button>
        <Button 
          color="primary"
          isDisabled={(page+1)*rowsPerPage > transactionCount}
          isLoading={isTransactionsLoading}
          onClick={() => {
            setPage(page => page+1)
          }}
        >Next</Button>
      </div>
    )
  }, [page, setPage, transactionCount, rowsPerPage, isTransactionsLoading]);

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
    >
      <TableHeader columns={COLUMES}>
        {
          (column) => {
            return (
              <TableColumn className={`${COLUME_MAP[column.id as keyof typeof COLUME_MAP].headerCss}`} key={column.id}>
                {COLUME_MAP[column.id as keyof typeof COLUME_MAP].name}
              </TableColumn>
            )
          }
        }
      </TableHeader>
      <TableBody 
        loadingContent={<Spinner/>}
        loadingState={isTransactionsLoading ? 'loading' : 'idle'}
        items={transactions}
        emptyContent={isTransactionsLoading ? " " : "No rows to display."}
      >
      {(item) => (
        <TableRow key={item.id}>
          {(columnKey) => <TableCell className={`${COLUME_MAP[columnKey as keyof typeof COLUME_MAP].cellCss}`}>{renderCell(item, columnKey)}</TableCell>}
        </TableRow>
      )}
      </TableBody>
    </Table>
  )
}
