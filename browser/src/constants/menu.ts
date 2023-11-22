const  menus: Menus = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    href: '/dashboard'
  },
  {
    id: 'sendMoney',
    name: 'Send Money',
    href: '/sendMoney',
    handler: () => {
      alert("TODO: Transafer")
    }
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
  }
]
export default menus