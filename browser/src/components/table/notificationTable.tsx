"use client"

import useSWR from 'swr'

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
import type { GetNotification, GetNotifications } from '@/types/notification'
import { NotificationStatus } from '@prisma/client'
import { HttpGET } from '@/types/http'

enum COLUME_TYPE {
  SUBJECT='subject',
  CONTENT='content',
  CREATED_AT='createdAt',
  ALL='All'
}
const COLUME_MAP = {
  [COLUME_TYPE.SUBJECT]: {
    name: 'Subject',
    headerCss: 'max-sm:hidden',
    cellCss: 'max-sm:hidden'
  },
  [COLUME_TYPE.CONTENT]: {
    name: 'Content',
    headerCss: 'max-sm:hidden',
    cellCss: 'max-sm:hidden'
  },
  [COLUME_TYPE.ALL]: {
    name: 'Notifications',
    headerCss: 'sm:hidden',
    cellCss: 'sm:hidden'
  },
  [COLUME_TYPE.CREATED_AT]: {
    name: 'Date',
    headerCss: 'max-sm:hidden',
    cellCss: 'max-sm:hidden'
  }
}

const COLUMES = Object.keys(COLUME_MAP).map(k => ({id: k}))

const SubjectCell = ({subject, status}: GetNotification) => {
  // const showSubject = subject.length > 30 ? subject.substring(0, 30) + '.' : subject
  return (
    // <TableCell>
      <p className={`${status === NotificationStatus.UN_READ ? 'font-semibold' : ''} max-w-[180px] overflow-x-clip`}>{subject}</p>
    // </TableCell>
  )
}

const ContentCell = ({content, status}: GetNotification) => {
  return (
    // <TableCell>
      <p className={`${status === NotificationStatus.UN_READ ? 'font-semibold' : ''} max-w-lg text-ellipsis overflow-clip whitespace-nowrap`}>{content}</p>
    // </TableCell>
  )
}

const CreatedCell = ({createdAt, status}: GetNotification) => {
  return (
    // <TableCell>
      <p className={`${status === NotificationStatus.UN_READ ? 'font-semibold' : ''}`}>{formatRelativeDate(createdAt)}</p>
    // </TableCell>
  )
}

const AllCell = ({notification}: {notification: GetNotification}) => {
  return (
    <>
      <p className={`${notification.status === NotificationStatus.UN_READ ? 'font-semibold' : ''}`}>{notification.subject}</p>
      <p className={`${notification.status === NotificationStatus.UN_READ ? 'font-semibold' : ''}`}>{notification.content}</p>
      <p className={`${notification.status === NotificationStatus.UN_READ ? 'font-semibold' : ''}`}>{formatRelativeDate(notification.createdAt)}</p>
    </>
  )
}

const fetcher = (url: string) => fetch(url).then(async (res) => {
  const data = await res.json() as HttpGET<GetNotifications>
  // console.log("do something: ", data)

  return data.payload.many
})

// TODO: Pagination
export function NotificationTable(): React.JSX.Element {

  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(20)

  const {data, isLoading} = useSWR<GetNotifications>(`/api/nbp/user/notification?from=${page-1}&size=${rowsPerPage}`, fetcher, {
    keepPreviousData: true,
  });

  console.log(data)
  const renderCell = useCallback((notication: GetNotification, columnKey: React.Key) => {
    switch(columnKey) {
      case COLUME_TYPE.SUBJECT:
        return (
          <SubjectCell {...notication}/>
        )
      case COLUME_TYPE.CONTENT:
        return (
          <ContentCell {...notication}/>
        )
      case COLUME_TYPE.CREATED_AT:
        return (
          <CreatedCell {...notication}/>
        )
      case COLUME_TYPE.ALL:
        return (
          <AllCell notification={notication}/>
        )
      default:
        return <TableCell>{''}</TableCell>
    }
  }, [])

  // const pages = Math.ceil(notifications.length / rowsPerPage);

  // const bottomContent = useMemo(() => {
  //   return (
  //     <div className="py-2 px-2 flex justify-center items-center">
  //       <Pagination
  //         isCompact
  //         showControls
  //         showShadow
  //         color="primary"
  //         page={page}
  //         total={pages}
  //         onChange={setPage}
  //       />
  //     </div>
  //   );
  // }, [page, pages]);

  // const items = useMemo(() => {
  //   const start = (page - 1) * rowsPerPage;
  //   const end = start + rowsPerPage;

  //   return notifications.slice(start, end)
  // }, [page, notifications, rowsPerPage])

  const topContent = useMemo(() => {
    //TODO: reload, mark all, p
    return (
      <div className="flex justify-between">
        <p>TODO: make as read and slider</p>
      </div>
    )
  }, [])

  return (
    <Table
      aria-label="Notification table"
      isStriped
      removeWrapper
      topContent={topContent}
      // bottomContent={bottomContent}
      topContentPlacement="outside"
      onRowAction={(key) => alert(`Opening item ${key}...`)}
    >
      <TableHeader columns={COLUMES}>
        {(column) => {
        // console.log(COLUME_MAP[column.id].css)
          return (
            <TableColumn className={`${COLUME_MAP[column.id as keyof typeof COLUME_MAP].headerCss}`} key={column.id}>
              {COLUME_MAP[column.id as keyof typeof COLUME_MAP].name}
            </TableColumn>
          )
        }}
      </TableHeader>
      <TableBody
        items={data ?? []}
        emptyContent={"No rows to display."}
        isLoading={isLoading}
      >
        {(notification) => (
          <TableRow key={notification.id} className="hover:cursor-pointer">
            {(columnId) => {
                return (
                  <TableCell className={`${COLUME_MAP[columnId as keyof typeof COLUME_MAP].cellCss}`}>
                    {renderCell(notification, columnId)}
                  </TableCell>
                )
              }
            }
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}