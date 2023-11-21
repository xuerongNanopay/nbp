import Nav from '@/components/layout/nav'
import SideNav from '@/components/layout/sideNav'

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
        <div className="w-64 min-h-screen h-screen fixed border border-sky-800 z-50">
          <SideNav></SideNav>
        </div>
        <div className="flex">
          <div className="flex-none min-h-screen w-64">
          </div>
          <div 
            className="flex-auto border border-orange-800 pt-12"
          >
            <div className="border border-orange-800 max-w-[1048px] py-4 px-2 mx-auto">
              {children}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
