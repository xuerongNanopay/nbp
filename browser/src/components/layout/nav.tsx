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
  Avatar
} from "@nextui-org/react"

import NextUIProvider from '@/providers/NextUIProvider'
import { 
  usePathname
} from 'next/navigation'

import NextLink from "next/link";
import menus from '@/constants/menu'
import { Menu } from "@/types/theme"
import { Session } from "@/types/auth"

export default function Nav({session}: {session: Session}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const curPath = usePathname()
  // console.log('INTESTIGATE: NAV TOGGLE mess up in build mode', isMenuOpen)
  return (
    <>
      <Navbar
        className="bg-white border-b-2 border-green-800"
        isBordered
        isMenuOpen={isMenuOpen}
        isMenuDefaultOpen={false}
        onMenuOpenChange={setIsMenuOpen}
      >
        <NavbarContent justify="start">
          <NavbarMenuToggle />
        </NavbarContent>
        <NavbarMenu className="max-w-[1024px] px-6 mx-auto">
          {/* TODO: investigating why mobile throw: Warning: Extra attributes from the server: aria-labelledby,aria-describedby */}
          <NextUIProvider>
            <div className="nbp">
              {
                menus.map((menu: Menu) => {
                  return (
                    <NavbarMenuItem key={menu.id} className="hover:bg-slate-200 rounded-md">
                      <Link
                        className={`${menu.href === curPath ? 'text-primary': 'text-slate-800'} w-full text-xl my-1 font-semibold hover:ps-2`}
                        color={"foreground"}
                        href={menu.href}
                        size="lg"
                        as={NextLink}
                        onClick={() => {setIsMenuOpen(false)}}
                      >
                        <span className="me-1">{menu.icon}</span>{menu.name}
                      </Link>
                    </NavbarMenuItem>
                )})
              }
            </div>
          </NextUIProvider>
        </NavbarMenu>
        <NavbarContent as="div" className="items-center" justify="end">
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                // isBordered
                as="button"
                className="transition-transform"
                color="primary"
                name={`${session.user?.firstName}`}
                size="md"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem textValue= "user" key="user" className="h-14 gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">{session.login.email}</p>
              </DropdownItem>
              <DropdownItem textValue="profile" key="profile">
                <Link href="/nbp/profile" className="text-slate-950 w-full">profile</Link>
              </DropdownItem>
              <DropdownItem textValue="notifications" key="notifications">
                <Link href="/nbp/notifications" className="text-slate-950 w-full">notifications</Link>
              </DropdownItem>
              <DropdownItem textValue="about" key="about">
                <Link href="/nbp/about" className="text-slate-950 w-full">about</Link>
              </DropdownItem>
              <DropdownItem textValue= "logout" key="logout" color="danger">
                <Link href="/nbp/sign_out" className="text-slate-950 w-full">Log Out</Link>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      </Navbar>
    </>
  )
}
