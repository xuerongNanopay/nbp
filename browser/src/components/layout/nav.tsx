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

import NextLink from "next/link";
import menus from '@/constants/menu'

export default function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
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
          {menus.map((item: Menu) => {
            return (
              <NavbarMenuItem key={item.id} className="hover:bg-slate-200 rounded-md">
                <Link
                  className="w-full hover:font-semibold"
                  color={"foreground"}
                  href={item.href}
                  size="lg"
                  as={NextLink}
                  onPressEnd={() => {setIsMenuOpen(false)}}
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
              <DropdownItem textValue="profile" key="profile">
                <Link href="/profile" className="text-slate-950">profile</Link>
              </DropdownItem>
              <DropdownItem textValue="notifications" key="notifications">
                <Link href="/notifications" className="text-slate-950">notifications</Link>
              </DropdownItem>
              <DropdownItem textValue="about" key="about">
                <Link href="/about" className="text-slate-950">about</Link>
              </DropdownItem>
              <DropdownItem textValue= "logout" key="logout" color="danger" onPress={_ => alert("TODO: Logout")}>
                <p>Log Out</p>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      </Navbar>
    </>
  )
}
