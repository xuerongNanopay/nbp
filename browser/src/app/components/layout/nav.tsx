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

const menuItems = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    href: '/dashboard'
  },
  {
    id: 'sendMoney',
    name: 'Send Money',
    href: '/transfer'
  },
  {
    id: 'contacts',
    name: 'Contacts',
    href: '/contacts'
  },
  {
    id: 'transaction',
    name: 'Transactions',
    href: '/transactions'
  },
  {
    id: 'profile',
    name: 'Profile',
    href: '/profile'
  },
  {
    id: 'about',
    name: 'About',
    href: '/about'
  }
];

export default function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <Navbar 
      isBordered
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent justify="start">
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu className="max-w-[1024px] px-6 mx-auto">
        {menuItems.map((item) => (
          <NavbarMenuItem key={item.id}>
            <Link
              className="w-full hover:font-semibold"
              color={"foreground"}
              href={item.href}
              size="lg"
              as={NextLink}
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>

      <NavbarContent as="div" className="items-center" justify="end">
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="secondary"
              name="Jason Hughes"
              size="sm"
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
  )
}
