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
  Pagination,
  Link
} from "@nextui-org/react";

import { SearchIcon } from '@/icons/SearchIcon'
import { PlusIcon } from '@/icons/PlusIcon'
import { EyeIcon } from '@/icons/EyeIcon'
import { ChevronDownIcon } from '@/icons/ChevronDownIcon'

const statusOptions = [
  {name: "VERIFIED", id: "verified"},
  {name: "FAILED", id: "failed"},
  {name: "PENDING", id: 'pending'}
]

const statusColorMap: Record<string, ChipProps["color"]>  = {
  verified: "success",
  failed: "danger",
  pending: "secondary"
}

const statusTextMap: Record<string, string>  = {
  verified: "VERIFIED",
  failed: "FAILED",
  pending: "PENDING"
}

const columns = [
  { name: 'Contact', id: 'contact' }
]

const StatusCell = ({status}: NBPContactSummary) => {
  return (
    <Chip className="capitalize" color={statusColorMap[status]} size="sm" variant="flat">
      {statusTextMap[status]}
    </Chip>
  )
}

const ContactSummaryCell = ({contact}:{ contact: NBPContactSummary}) => {
  return (
    <div className="flex justify-between">
      <div className="flex flex-col ms-2">
        <p className="text-bold text-sm capitalize">{`${contact.firstName} ${contact.lastName}`}</p>
        <p className="text-slate-400 my-1">{contact.accountSummary}</p>
        <StatusCell {...contact}/>
      </div>
      <Link href={`/contacts/${contact.id}`} className="me-2">
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

const ActionsCell = (contact: NBPContactSummary) => {
  return (
    <div className="relative flex items-center gap-2">
      <Link href={`/contacts/${contact.id}`}>
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

export default function ContactTable({className, contacts}: {className?: string, contacts: NBPContactSummary[]}) {
  const [searchValue, setSearchValue] = React.useState('');
  const [page, setPage] = React.useState(1)
  const [rowsPerPage, setRowsPerPage] = React.useState(7)
  const [statusFilter, setStatusFilter] = React.useState<Selection>('all')

  const renderCell = React.useCallback((contact: NBPContactSummary, columnKey: React.Key) => {
    switch(columnKey) {
      case "contact":
        return (
          <ContactSummaryCell contact={contact}/>
        )
      case "actions":
        return (
          <ActionsCell {...contact}/>
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

  const filteredContacts = React.useMemo(() => {
    let filteredContacts = [...contacts];

    if (Boolean(searchValue)) {
      filteredContacts = filteredContacts.filter((transaction) =>
        (transaction.firstName + ' ' + transaction.lastName).toLowerCase().includes(searchValue.toLowerCase()),
      );
    }
    if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
      filteredContacts = filteredContacts.filter((contact) =>
        Array.from(statusFilter).includes(contact.status),
      );
    }

    return filteredContacts;
  }, [contacts, searchValue, statusFilter])

  const pages = Math.ceil(filteredContacts.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredContacts.slice(start, end)
  }, [page, filteredContacts, rowsPerPage])

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-start sm:flex-row justify-between gap-3 sm:items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name"
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
                  <DropdownItem key={status.id} className="capitalize">
                    {status.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button color="primary" href="/createContact" as={Link} endContent={<PlusIcon />}>
              New Contact
            </Button>
          </div>
        </div>
        <div className="flex flex-col items-start sm:flex-row justify-between sm:items-center">
          <span className="text-default-400 text-small">Total {filteredContacts.length} Contacts</span>
        </div>
      </div>
    )
  },[
    searchValue,
    onSearchValueChange,
    statusFilter,
    setStatusFilter,
    onClear,
    filteredContacts.length
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
      aria-label="Contact table"
      className={`w-full max-w-5xl ${className}`}
      isStriped={true}
      topContent={topContent}
      hideHeader={true}
      isHeaderSticky
      topContentPlacement="outside"
      removeWrapper
      bottomContent={bottomContent}
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