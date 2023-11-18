import IconHeader  from '@/components/header/IconHeader'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <IconHeader className="mb-8"></IconHeader>
      <div className="flex justify-center px-4 lg:px-0">
        {children}
      </div>
    </div>
  )
}
