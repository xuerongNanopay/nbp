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
  Tooltip,
  Pagination
} from '@nextui-org/react'

import {
  ReloadIcon
} from '@/icons/ReloadIcon'
import { EyeIcon } from '@/icons/EyeIcon'

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

// TODO: Pagination
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

  const pages = Math.ceil(notifications.length / rowsPerPage);

  const bottomContent = useMemo(() => {
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

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return notifications.slice(start, end)
  }, [page, notifications, rowsPerPage])

  const topContent = useMemo(() => {
    //TODO: reload, mark all, p
    return (
      <div className="flex justify-between">
        <div className="flex items-center">
          <div className="mx-2">
            <Tooltip content="reload">
              <span 
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
              >
                <ReloadIcon/>
              </span>
            </Tooltip>
          </div>
          <div>
            <Tooltip content="Mark all as Read">
            <span 
              className="text-lg text-default-400 cursor-pointer active:opacity-50"
            >
              <EyeIcon/>
            </span>
            </Tooltip>  
          </div>
        </div>
        <div className="flex">
          {/* <div className="me-2">1-50 of 100,1</div> */}
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
      // topContent={topContent}
      bottomContent={bottomContent}
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
        items={items}
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