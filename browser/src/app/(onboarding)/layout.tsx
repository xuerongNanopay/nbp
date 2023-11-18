import IconHeader  from '@/components/header/IconHeader'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <IconHeader></IconHeader>
      {children}
    </div>
  )
}
