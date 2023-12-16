import { Menu } from "@/types/theme"

const menus: Menu[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    href: '/nbp/dashboard'
  },
  {
    id: 'sendMoney',
    name: 'Send Money',
    href: '/nbp/transfer'
  },
  {
    id: 'contacts',
    name: 'Contacts',
    href: '/nbp/contacts'
  },
  {
    id: 'transactions',
    name: 'Transactions',
    href: '/nbp/transactions'
  }
]
export default menus