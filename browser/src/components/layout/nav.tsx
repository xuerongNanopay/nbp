'use client'
import { useState } from "react"

import {
  Navbar, 
  NavbarContent, 
  Link, 
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  DropdownItem, 
  DropdownTrigger, 
  Dropdown, 
  DropdownMenu,
  Avatar,
  Modal,
  ModalContent
} from "@nextui-org/react"

import { PressEvent } from "@react-types/shared"
import NextLink from "next/link";
import menus from '@/constants/menu'

import QuoteForm from "../form/quoteForm";
import NextUIProvider from "@/providers/NextUIProvider";

export default function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isTransferWizardOpen, setisTransferWizardOpen] = useState(false)
  
  const newMenus = [...menus, {
    id: 'sendMoney',
    name: 'Send Money',
    href: '/sendMoney',
    handler: () => {setisTransferWizardOpen(true)}
  }]
  return (
    <>
      <Navbar
        className="bg-white border-b-2 border-green-800"
        isBordered
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
      >
        <NavbarContent justify="start">
          <NavbarMenuToggle />
        </NavbarContent>

        <NavbarMenu className="max-w-[1024px] px-6 mx-auto">
          {newMenus.map((item: Menu) => {
            const customerHandler = !item.handler ? 
              (e: PressEvent) => {
                setIsMenuOpen(false)
              }
              : (e: PressEvent) => {
                setIsMenuOpen(false)
                if ( !!item.handler ) item.handler()
              }
            return (
              <NavbarMenuItem key={item.id} className="hover:bg-slate-200 rounded-md">
                <Link
                  className="w-full hover:font-semibold"
                  color={"foreground"}
                  href={!item.handler ? item.href : '#'}
                  size="lg"
                  as={NextLink}
                  onPress={customerHandler}
                >
                  {item.name}
                </Link>
              </NavbarMenuItem>
          )})}
        </NavbarMenu>

        <NavbarContent as="div" className="items-center" justify="end">
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                // isBordered
                as="button"
                className="transition-transform"
                color="primary"
                name="Jason Hughes"
                size="md"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem textValue= "profle" key="profile" className="h-14 gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">zoey@example.com</p>
              </DropdownItem>
              <DropdownItem textValue= "logout" key="logout" color="danger" onPress={_ => alert("TODO: Logout")}>
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      </Navbar>
      <Modal
        isOpen={isTransferWizardOpen} 
        placement="center"
      >
        {/* <ModalContent>
          {/* Modal will escape NextUIProvider, so need to add it again*/}
          <NextUIProvider>
            <div className="nbp">
              <QuoteForm/>
            </div>
          </NextUIProvider>
        </ModalContent> */}
      </Modal>
    </>
  )
}
