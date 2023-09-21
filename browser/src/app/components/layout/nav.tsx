'use client'
import { useState } from "react"

import {
  Navbar, 
  NavbarBrand, 
  NavbarContent, 
  NavbarItem, 
  Link, 
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Button,
  DropdownItem, 
  DropdownTrigger, 
  Dropdown, 
  DropdownMenu,
  Avatar
} from "@nextui-org/react"

const menuItems = [
  "Dashboard",
  "Send Money",
  "Contacts",
  "Transactions",
  "Profile",
  "About"
];

export default function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <Navbar isBordered>
      <NavbarContent justify="start">
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu className="max-w-[1024px] px-6 mx-auto">
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full"
              color={"foreground"}
              href="#"
              size="lg"
            >
              {item}
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
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">Signed in as</p>
              <p className="font-semibold">zoey@example.com</p>
            </DropdownItem>
            <DropdownItem key="logout" color="danger" onPress={_ => alert("TODO: Logout")}>
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  )
}
