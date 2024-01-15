import Nav from '@/components/layout/nav'
import SideNav from '@/components/layout/sideNav'
import { fetchSession } from '@/lib/session'
import { LoginStatus } from '@prisma/client'
import { redirect } from 'next/navigation'

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  //TODO: using middleware for auth guard.
  const session = await fetchSession()
  if(!session || !session.login) redirect('/nbp/sign_in')

  if (session.login.status === LoginStatus.AWAIT_VERIFY) redirect('/nbp/verify_email')
  if (session.user === null) redirect('/nbp/onboarding')

  return (
    // TODO: use nextAuth backEnd UI
    // <SessionProvider session={session}>
      <main>
        <div className="lg:hidden sticky top-0 z-50">
          <Nav session={session}/>
        </div>
        <div className="max-w-[1024px] mx-auto lg:hidden">
          <div className="pt-4 px-2 pb-4">
            {children}
          </div>
        </div>
        <div className="max-lg:hidden">
          <div className="w-60 min-h-screen h-screen fixed border border-sky-800 z-50">
            <SideNav session={session}></SideNav>
          </div>
          <div className="flex">
            <div className="flex-none min-h-screen w-60">
            </div>
            <div 
              className="flex-auto border border-orange-800 pt-4"
            >
              <div className="max-w-[1048px] py-2 px-4 mb-4 mx-auto">
                {children}
              </div>
            </div>
          </div>
        </div>
      </main>
    // </SessionProvider>
  )
}
