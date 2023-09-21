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

import { SearchIcon } from '@/app/icons/SearchIcon'
import { PlusIcon } from '@/app/icons/PlusIcon'
import { EyeIcon } from '@/app/icons/EyeIcon'
import { ChevronDownIcon } from '@/app/icons/ChevronDownIcon'
import { DeleteIcon } from '@/app/icons/DeleteIcon'
import { SendMoneyIcon } from '@/app/icons/SendMoneyIcon'

const statusOptions = [
  {name: "VERIFY", uid: "verify"},
  {name: "UNVERIFY", uid: "unverify"},
  {name: "UNKNOWN", uid: 'unknown'}
]

const statusColorMap: Record<string, ChipProps["color"]>  = {
  verified: "success",
  unverified: "danger",
  pending: "danger"
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
      {/* TODO */}
      {/* <Tooltip content="Send">
        <span 
          className="text-lg text-default-400 cursor-pointer active:opacity-50"
          onClick={sendWrapper(contact.id)}
        >
          <SendMoneyIcon/>
        </span>
      </Tooltip> */}
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
}