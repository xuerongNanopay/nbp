import Nav from '@/components/layout/nav'
import SideNav from '@/components/layout/sideNav'
// import { UserProvider } from '@/hook/userProvider'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // TODO: use nextAuth backEnd UI
    // <UserProvider value={111}>
      <main>
        <div className="lg:hidden">
          <Nav></Nav>
        </div>
        <div className="max-w-[1024px] mx-auto lg:hidden">
          <div className="pt-4 px-2">
            {children}
          </div>
        </div>
        <div className="max-lg:hidden">
          <div className="w-60 min-h-screen h-screen fixed border border-sky-800 z-50">
            <SideNav></SideNav>
          </div>
          <div className="flex">
            <div className="flex-none min-h-screen w-60">
            </div>
            <div 
              className="flex-auto border border-orange-800 pt-4"
            >
              <div className="max-w-[1048px] py-2 px-4 mx-auto">
                {children}
              </div>
            </div>
          </div>
        </div>
      </main>
    // </UserProvider>
  )
}
