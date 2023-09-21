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
  Pagination
} from "@nextui-org/react";

import contacts from '@/app/tests/dummyContactResults';

import { SearchIcon } from '@/app/icons/SearchIcon'
import { PlusIcon } from '@/app/icons/PlusIcon'
import { EyeIcon } from '@/app/icons/EyeIcon'
import { ChevronDownIcon } from '@/app/icons/ChevronDownIcon'
import { DeleteIcon } from '@/app/icons/DeleteIcon'
import { SendMoneyIcon } from '@/app/icons/SendMoneyIcon'

const statusOptions = [
  {name: "VERIFIED", uid: "verified"},
  {name: "UNVERIFIED", uid: "unverified"},
  {name: "PENDING", uid: 'pending'}
]

const statusColorMap: Record<string, ChipProps["color"]>  = {
  verified: "success",
  unverified: "danger",
  pending: "secondary"
}

const statusTextMap: Record<string, string>  = {
  verified: "VERIFIED",
  unverified: "UNVERIFIED",
  pending: "PENDING"
}

const columns = [
  { name: 'Remittee', uid: 'remitee' },
  { name: 'Account', uid: 'remiteeAccount'},
  { name: 'Status', uid: 'status' },
  { name: 'Actions', uid: 'actions' }
]

const RemitteeCell = (contact: IContactResult) => {
  return (
    <div className="flex flex-col">
      <p className="text-bold text-sm capitalize">{`${contact.firstName} ${contact.lastName}`}</p>
    </div>
  )
}

const AccountCell = (contact: IContactResult) => {
  return (
    <>
      <p>{contact.transferMethod === 'bankAccount' ? "TODO: format" : "Cash Pickup"}</p>
    </>
  )
}

const StatusCell = ({status}: IContactResult) => {
  return (
    <Chip className="capitalize" color={statusColorMap[status]} size="sm" variant="flat">
      {statusTextMap[status]}
    </Chip>
  )
}

const showDetailWrapper = (contactId: string) => {
  return () => {
    alert("TODO: SHOW DETAIl: " + contactId)
  }
}

const sendWrapper = (contactId: string) => {
  return () => {
    alert("TODO: Send " + contactId)
  }
}

const deleteWrapper = (contactId: string) => {
  return () => {
    alert("TODO: Delete Contact: " + contactId)
  }
}

const ActionsCell = (contact: IContactResult) => {
  return (
    <div className="relative flex items-center gap-2">
      <Tooltip content="Details">
        <span 
          className="text-lg text-default-400 cursor-pointer active:opacity-50"
          onClick={showDetailWrapper(contact.id)}
        >
          <EyeIcon/>
        </span>
      </Tooltip>
    </div>
  )
}

export default function ContactTable() {
  const [searchValue, setSearchValue] = React.useState('');
  const [page, setPage] = React.useState(1)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [statusFilter, setStatusFilter] = React.useState<Selection>('all')

  const renderCell = React.useCallback((contact: IContactResult, columnKey: React.Key) => {
    switch(columnKey) {
      case "remitee":
        return (
          <RemitteeCell {...contact}/>
        )
      case "remiteeAccount":
        return (
          <AccountCell {...contact}/>
        )
      case "status":
        return (
          <StatusCell {...contact}/>
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

    // if (Boolean(searchValue)) {
    //   filteredContacts = filteredContacts.filter((transaction) =>
    //     transaction.remiteeName.toLowerCase().includes(searchValue.toLowerCase()),
    //   );
    // }
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
              New Contact
            </Button>
          </div>
        </div>
        <div className="flex flex-col items-start sm:flex-row justify-between sm:items-center">
          <span className="text-default-400 text-small">Total {filteredContacts.length} Contacts</span>
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
    onRowsPerPageChange,
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