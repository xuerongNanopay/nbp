"use client"

import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell
} from '@nextui-org/react'

type Props = {
  className?: string,
  notifications: NotificationSummary[]
}

const columns = [
  { id: 'subject', name: 'Subject' },
  { id: 'created', name: 'date'}
]

export function NotificationTable({className, notifications}: Props): React.JSX.Element {
  return (
    <Table
      aria-label="Notification table"
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
          <TableRow key={notification.id}>
            {(columeKey) => 
              <TableCell>
                aaaa
              </TableCell>
            }
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}