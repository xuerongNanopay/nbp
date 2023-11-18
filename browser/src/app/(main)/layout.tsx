import Nav from '@/components/layout/nav'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main>
      <Nav></Nav>
      <div className="max-w-[1024px] mx-auto">
        {children}
      </div>
    </main>
  )
}
