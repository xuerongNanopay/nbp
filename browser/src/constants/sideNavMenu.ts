const  menus: Menus = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    href: '/dashboard'
  },
  {
    id: 'contacts',
    name: 'Contacts',
    href: '/contacts'
  },
  {
    id: 'transactions',
    name: 'Transactions',
    href: '/transactions'
  },
  {
    id: 'sendMoney',
    name: 'Send Money',
    href: '/transfer',
    handler: () => {
      alert("TODO: Transafer")
    }
  },
]
export default menus