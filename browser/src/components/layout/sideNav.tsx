'use client'
import {
  Link,
  Listbox,
  ListboxItem
} from '@nextui-org/react'

import { useRouter } from 'next/navigation'

import menus from '@/constants/sideNavMenu'

//TODO: using dropdown Menu
export default function SideNav() {
  const router = useRouter()

  return (
    <div className="h-full flex flex-col">
      <header className="h-16 flex-initial px-2 border border-red-500">Icon</header>
      <section className="flex-auto px-2 border border-red-500">
        <Listbox
          aria-label="Menu" 
          onAction={(key) => { 
            const m = menus.find(menu => menu.id === key)
            if ( !!m ) router.push(m?.href)
          }}
        >
          {menus.map((menu)=> (
            <ListboxItem key={menu.id}>{menu.name}</ListboxItem>
          ))}
        </Listbox>
      </section>
      <footer className="flex-initial px-2 border border-red-500">
        <Listbox
          aria-label="Profile" 
          // disabledKeys={["edit", "delete"]}
          // onAction={(key) => alert(key)}
        >
          <ListboxItem key="notifications">Notifications</ListboxItem>
          <ListboxItem key="user">User</ListboxItem>
        </Listbox>
      </footer>
    </div>
  )
}
