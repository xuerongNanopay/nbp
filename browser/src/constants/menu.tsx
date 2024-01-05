import { Menu } from "@/types/theme"

import { MdOutlineDashboard } from "react-icons/md"
import { FiSend } from "react-icons/fi"
import { RiContactsLine } from "react-icons/ri"
import { IoReorderFour } from "react-icons/io5"

const menus: Menu[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    href: '/nbp/dashboard',
    icon: <MdOutlineDashboard/>
  },
  {
    id: 'sendMoney',
    name: 'Send Money',
    href: '/nbp/transfer',
    icon: <FiSend/>
  },
  {
    id: 'contacts',
    name: 'Contacts',
    href: '/nbp/contacts',
    icon: <RiContactsLine/>
  },
  {
    id: 'transactions',
    name: 'Transactions',
    href: '/nbp/transactions',
    icon: <IoReorderFour/>
  }
]
export default menus