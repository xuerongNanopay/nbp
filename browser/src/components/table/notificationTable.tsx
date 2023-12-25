"use client"

import useSWR from 'swr'

import { 
  useCallback, 
  useEffect, 
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
  Pagination,
  Spinner,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Modal,
  useDisclosure
} from '@nextui-org/react'

import { formatRelativeDate } from '@/utils/dateUtil'
import type { GetNotification, GetNotifications } from '@/types/notification'
import { NotificationStatus, NotificationLevel, UserStatus } from '@prisma/client'
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
      <p className={`${status === NotificationStatus.UN_READ ? 'font-bold' : ''} max-w-[160px] overflow-x-clip`}>{subject}</p>
    // </TableCell>
  )
}

const ContentCell = ({content, status}: GetNotification) => {
  return (
    // <TableCell>
      <p className={`${status === NotificationStatus.UN_READ ? 'font-bold' : ''} text-slate-700  max-w-lg text-ellipsis overflow-clip whitespace-nowrap`}>{content}</p>
    // </TableCell>
  )
}

const CreatedCell = ({createdAt, status}: GetNotification) => {
  return (
    // <TableCell>
      <p className={`${status === NotificationStatus.UN_READ ? 'font-bold' : ''} text-slate-600 italic`}>{formatRelativeDate(createdAt)}</p>
    // </TableCell>
  )
}

const AllCell = ({notification}: {notification: GetNotification}) => {
  // console.log('Akk', notification.status)
  return (
    <>
      <p className={`${notification.status === NotificationStatus.UN_READ ? 'font-bold' : ''}`}>{notification.subject}</p>
      <p className={`${notification.status === NotificationStatus.UN_READ ? 'font-bold' : ''} text-slate-700 text-ellipsis overflow-clip whitespace-nowrap max-w-xs`}>{notification.content}</p>
      <p className={`${notification.status === NotificationStatus.UN_READ ? 'font-bold' : ''} text-slate-600 italic`}>{formatRelativeDate(notification.createdAt)}</p>
    </>
  )
}

const fetcher = (url: string) => fetch(url).then(async (res) => {
  const data = await res.json() as HttpGET<GetNotifications>
  return data.payload
})

export function NotificationTable(): React.JSX.Element {
  const {isOpen, onOpen, onOpenChange} = useDisclosure()
  const [showNotification, setShowNotification] = useState<GetNotification>({id: 0, subject: "", content: "", createdAt: new Date(), level: NotificationLevel.INFO, status: NotificationStatus.READ})
  const [reads, setReads] = useState<number[]>([])
  const [page, setPage] = useState(1)
  const [notifications, setNotifications] = useState<GetNotifications>([])
  // Ticket to prevent pages reset to zero when data is empty.
  const [_pages, _setPages] = useState(1)
  const rowsPerPage = 15
  // const reads = []
  const {data, isLoading} = useSWR(`/api/nbp/user/notifications?from=${(page-1)*rowsPerPage}&size=${rowsPerPage}`, fetcher, {
    revalidateOnFocus: false,
    // keepPreviousData: true
  })
  const loadingState = isLoading || data?.many?.length === 0 ? "loading" : "idle"

  const pages = useMemo(() => {
    if ( !data ) {
      return _pages
    }
    const newPage =  Math.ceil(data.meta.count / rowsPerPage)
    _setPages(newPage)
    return newPage
  }, [data?.meta.count, _pages])

  useEffect(()=> {
    if (!!data) {
      setNotifications(data.many)
    }
  }, [data])

  // useEffect(() => {
  //   if (reads.length > 0) {
  //     // I don't care if it is successful or not. Since it is not important
  //     const mark_reads = reads
  //     console.log('aavv')
  //     setReads([])
  //     fetch('/api/nbp/user/notifications/mark_read', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({ids: mark_reads})
  //     }).catch(err => {console.error(err)}) 
  //   }
  //   return () => {
  //     console.log('ffff clean')
  //   }
  // }, [page])

  const onRowClick = (key: React.Key) => {
    if (!data) return
    const idx = data.many.findIndex((n) => n.id == key)
    if (idx < 0) return
    if (notifications[idx].status !== NotificationStatus.READ) {
      fetch('/api/nbp/user/notifications/mark_read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ids: [notifications[idx].id]})
      }).catch(err => {console.error(err)}) 
    }
    notifications[idx].status = NotificationStatus.READ
    reads.push(notifications[idx].id)
    setNotifications([...notifications.slice(0, idx), {...notifications[idx], status: NotificationStatus.READ}, ...notifications.slice(idx+1)])
    setShowNotification(notifications[idx])
    onOpen()
  }

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

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-center items-center">
        <Pagination
          isCompact
          showControls
          showShadow
          initialPage={1}
          total={pages} 
          color="primary"
          page={page}
          onChange={(newPage) => {
            setPage(newPage)
          }}
        />
      </div>
    );
  }, [pages, page]);

  const topContent = useMemo(() => {
    //TODO: reload, mark all, p
    return (
      <div className="flex justify-between">
        <p>TODO: make as read and slider</p>
      </div>
    )
  }, [])

  return (
    <>
      <Table
        aria-label="Notification table"
        isStriped
        removeWrapper
        topContent={topContent}
        bottomContent={bottomContent}
        topContentPlacement="outside"
        onRowAction={onRowClick}
      >
        <TableHeader columns={COLUMES}>
          {(column) => {
            return (
              <TableColumn className={`${COLUME_MAP[column.id as keyof typeof COLUME_MAP].headerCss}`} key={column.id}>
                {COLUME_MAP[column.id as keyof typeof COLUME_MAP].name}
              </TableColumn>
            )
          }}
        </TableHeader>
        <TableBody
          items={notifications}
          emptyContent={isLoading ? " " : "No rows to display."}
          loadingContent={<Spinner/>}
          loadingState={loadingState}
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
      <DetailModal isOpen={isOpen} onOpenChange={onOpenChange} notification={showNotification}/>
    </>
  )
}

const NotificationDetailHeaderColor = {
  [NotificationLevel.INFO]: 'text-green-800',
  [NotificationLevel.WARM]: 'text-orange-800',
  [NotificationLevel.ERROR]: 'text-red-800',
}
const DetailModal = (
  {
    isOpen,
    notification,
    onOpenChange,
  }: {
    notification: GetNotification
    isOpen: boolean,
    onOpenChange: () => void,
  }
) => {
  return (
    <>
        <Modal placement="center" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {
            (onClose) => (
              <>
                <ModalHeader>
                  <p className={`font-bold ${NotificationDetailHeaderColor[notification.level]}`}>{notification.subject}</p>
                </ModalHeader>
                <ModalBody>
                  <p className="font-semibold">{notification.content}</p>
                  <p className="text-slate-700 font-semibold italic">{notification.createdAt.toLocaleString()}</p>
                </ModalBody>
              </>
            )
          }
        </ModalContent>
      </Modal>
    </>
  )
}