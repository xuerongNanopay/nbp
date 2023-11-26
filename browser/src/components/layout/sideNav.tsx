'use client'
import {
  Link,
  Listbox,
  ListboxItem,
  Dropdown,
  DropdownItem,
  Avatar,
  DropdownMenu,
  DropdownTrigger,
  User,
  Badge
} from '@nextui-org/react'

import { 
  usePathname
} from 'next/navigation'

import menus from '@/constants/menu'

export default function SideNav() {
  const curPath = usePathname()
  return (
    <div className="h-full flex flex-col">
      <header className="h-16 flex-initial px-2 border border-red-500">Icon</header>
      <section className="flex-auto px-2 pt-4 border border-red-500">
        <Listbox
          aria-label="Menu" 
        >
          {menus.map((menu)=> (
            <ListboxItem key={menu.id} textValue={menu.name}>
              <Link
                className={`${menu.href === curPath ? 'text-primary': 'text-slate-800'} w-full text-lg font-semibold hover:ps-2`}
                href={menu.href}
              >
                {menu.name}
              </Link>
            </ListboxItem>
          ))}
        </Listbox>
      </section>
      <footer className="flex-initial px-2 border border-red-500 py-2">
        <Dropdown placement="top">
          <DropdownTrigger>
            {/* <Badge content="5" color="default"> */}
              <User
                name="Xuerong Wu"
                description="zoey@example.com"
                avatarProps={{
                  as: "button",
                  className: "transition-transform",
                  color: "primary",
                  size: "lg"
                }}
              />
            {/* </Badge> */}
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem textValue="profile" key="profile">
              <Link href="/profile" className="text-slate-950 w-full">profile</Link>
            </DropdownItem>
            <DropdownItem textValue="notifications" key="notifications">
              <Link href="/notifications" className="text-slate-950 w-full">notifications</Link>
            </DropdownItem>
            <DropdownItem textValue="about" key="about">
              <Link href="/about" className="text-slate-950 w-full">about</Link>
            </DropdownItem>
            <DropdownItem textValue= "logout" key="logout" color="danger" onPress={_ => alert("TODO: Logout")}>
              <p>Log Out</p>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </footer>
    </div>
  )
}
