import Nav from '@/components/layout/nav'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main>
      <div className="lg:hidden">
        <Nav></Nav>
      </div>
      <div className="max-w-[1024px] mx-auto lg:hidden">
        {children}
      </div>
      <div className="max-lg:hidden">
        {children}
      </div>
    </main>
  )
}
