import IconHeaderWithLogout  from '@/components/header/IconHeaderWithLogout'

export default function TransferLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <IconHeaderWithLogout className="mb-8"></IconHeaderWithLogout>
      <div className="flex justify-center px-4 lg:px-0">
        {children}
      </div>
    </div>
  )
}
