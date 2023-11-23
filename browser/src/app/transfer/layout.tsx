'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import IconHeaderWithLogout  from '@/components/header/IconHeaderWithLogout'

export default function TransferLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const to = searchParams.get('to')
  const from = searchParams.get('from')

  const onClose = () => {
    // TODO: if check url is other domain, then go to dashboard.
    router.back()
  }


  return (
    <div>
      <IconHeaderWithLogout className="mb-8" closeHandler={onClose}></IconHeaderWithLogout>
      <div className="flex justify-center px-4 lg:px-0">
        {children}
      </div>
    </div>
  )
}
