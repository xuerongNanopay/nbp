'use client'
import {
  Listbox,
  ListboxItem
} from '@nextui-org/react'

import { 
  useRouter,
  usePathname
} from 'next/navigation'

import menus from '@/constants/sideNavMenu'

export default function SideNav() {
  const router = useRouter()
  const curPath = usePathname()

  return (
    <div className="h-full flex flex-col">
      <header className="h-16 flex-initial px-2 border border-red-500">Icon</header>
      <section className="flex-auto px-2 pt-4 border border-red-500">
        <Listbox
          aria-label="Menu" 
          onAction={(key) => {
            const m = menus.find(menu => menu.id === key)
            if ( !!m ) {
              if ( !m.handler ) {
                router.push(m.href)
              } else {
                m.handler()
              }
            }
          }}
        >
          {menus.map((menu)=> (
            <ListboxItem key={menu.id} textValue={menu.name}>
              <div className={`text-lg ${curPath === menu.href ? 'text-green-800 font-semibold' : ''}`}>{menu.name}</div>
            </ListboxItem>
          ))}
        </Listbox>
      </section>
      <footer className="flex-initial px-2 border border-red-500">
        <Listbox
          aria-label='Profile'
        >
          <ListboxItem 
            key='notifications'
            textValue='notifications'
            onClick={() => {console.log('aaa');router.push('/notifications')}}
          >
            <div className={`text-lg ${curPath === '/notifications' ? 'text-green-800 font-semibold' : ''}`}>
              Notifications
            </div>
          </ListboxItem>
          <ListboxItem 
            key='user'
            textValue='User'
          >
            <div className={`text-lg ${curPath === '\\User' ? 'text-green-800 font-semibold' : ''}`}>
              User
            </div>
          </ListboxItem>
        </Listbox>
      </footer>
    </div>
  )
}
