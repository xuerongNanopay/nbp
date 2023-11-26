"use client"

import { 
  useCallback, 
  useMemo,
  useState
} from 'react'

import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Tabs,
  Tab
} from '@nextui-org/react'

import { formatRelativeDate } from '@/utils/dateUtil'

type Props = {
  className?: string,
  notifications: NotificationSummary[]
}

const columns = [
  { id: 'subject', name: 'Subject' },
  { id: 'description', name: 'Description' },
  { id: 'created', name: 'Date' }
]

const SubjectCell = ({subject, status}: NotificationSummary) => {
  return (
    <p className={`${status === 'unread' ? 'font-semibold' : ''}`}>{subject}</p>
  )
}

const DescriptionCell = ({description, status}: NotificationSummary) => {
  return (
    <p className={`${status === 'unread' ? 'font-semibold' : ''}`}>{description}</p>
  )
}

const CreatedCell = ({created, status}: NotificationSummary) => {
  return (
    <>
      <p className={`${status === 'unread' ? 'font-semibold' : ''}`}>{formatRelativeDate(created)}</p>
    </>
  )
}

export function NotificationTable({className, notifications}: Props): React.JSX.Element {

  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(15)

  const renderCell = useCallback((notication: NotificationSummary, columnKey: React.Key) => {
    switch(columnKey) {
      case "subject":
        return (
          <SubjectCell {...notication}/>
        )
      case "description":
        return (
          <DescriptionCell {...notication}/>
        )
      case "created":
        return (
          <CreatedCell {...notication}/>
        )
      default:
        return null
    }
  }, [])

  const topContent = useMemo(() => {
    //TODO: reload, mark all, p
    return (
      <div className="flex justify-between">
        <div className="flex">
          <p className="me-2">reloading</p>
          <p>mark all</p>
        </div>
        <div className="flex">
          <div className="me-2">1-50 of 100,1</div>
          <div>lefi right</div>
        </div>
      </div>
    )
  }, [])

  return (
    <Table
      aria-label="Notification table"
      isStriped
      className={`${className}`}
      removeWrapper
      topContent={topContent}
      topContentPlacement="outside"
      onRowAction={(key) => alert(`Opening item ${key}...`)}
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.id}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        items={notifications}
        emptyContent={"No rows to display."}
      >
        {(notification) => (
          <TableRow key={notification.id} className="hover:cursor-pointer">
            {(columeKey) => 
              <TableCell>
                {renderCell(notification, columeKey)}
              </TableCell>
            }
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}