import {
  Modal,
  ModalContent,
  useDisclosure
} from '@nextui-org/react'

import Nav from '@/components/layout/nav'
import SideNav from '@/components/layout/sideNav'
import QuoteForm from '@/components/form/quoteForm'
import SignInForm from '@/components/form/signInForm'
import NextUIProvider from '@/providers/NextUIProvider'

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
            className="flex-auto border border-orange-800 pt-12"
          >
            <div className="border border-orange-800 max-w-[1048px] py-4 px-2 mx-auto">
              {children}
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={true} 
        placement="center"
      >
        <ModalContent>
          {/* Modal will escape NextUIProvider, so need to add it again*/}
          <NextUIProvider>
            <div className="nbp">
              <QuoteForm/>
            </div>
          </NextUIProvider>
        </ModalContent>
      </Modal>
    </main>
  )
}
