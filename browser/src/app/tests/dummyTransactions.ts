const transactions: ITransaction[] = [
  {
    id: '1',
    remiteeName: 'XXX XX',
    remitAccount: 'NBP(****111)',
    remitMethod: 'bankAccount',
    receiveAmount: '12.22 PKR',
    cost: '22.33 CAD',
    status: 'complete', //waitingForPayment, sending, complete
    created: new Date(),
    etransferLink: 'https://www.youtube.com',
    paymentMethod: 'etransfer'
  },
  {
    id: '2',
    remiteeName: 'XXX XX',
    remitAccount: 'NBP(****111)',
    remitMethod: 'bankAccount',
    receiveAmount: '12.22 PKR',
    cost: '22.33 CAD',
    status: 'cancel', //waitingForPayment, sending, complete
    created: new Date('2023-01-01'),
    etransferLink: 'https://www.youtube.com',
    paymentMethod: 'etransfer'
  },
  {
    id: '3',
    remiteeName: 'XXX XX',
    remitAccount: '',
    remitMethod: 'cashPickup',
    receiveAmount: '12.22 PKR',
    cost: '22.33 CAD',
    status: 'awaitPayent', //waitingForPayment, sending, complete
    created: new Date(),
    etransferLink: 'https://www.youtube.com',
    paymentMethod: 'etransfer'
  },
  {
    id: '4',
    remiteeName: 'XXX XX',
    remitAccount: '',
    remitMethod: 'cashPickup',
    receiveAmount: '12.22 PKR',
    cost: '22.33 CAD',
    status: 'process', //waitingForPayment, sending, complete
    created: new Date(),
    etransferLink: 'https://www.youtube.com',
    paymentMethod: 'etransfer'
  },
  {
    id: '5',
    remiteeName: 'XXX XX',
    remitAccount: 'NBP(****111)',
    remitMethod: 'bankAccount',
    receiveAmount: '12.22 PKR',
    cost: '22.33 CAD',
    status: 'complete', //waitingForPayment, sending, complete
    created: new Date(),
    etransferLink: 'https://www.youtube.com',
    paymentMethod: 'etransfer'
  },
  {
    id: '6',
    remiteeName: 'XXX XX',
    remitAccount: 'NBP(****111)',
    remitMethod: 'bankAccount',
    receiveAmount: '12.22 PKR',
    cost: '22.33 CAD',
    status: 'cancel', //waitingForPayment, sending, complete
    created: new Date(),
    etransferLink: 'https://www.youtube.com',
    paymentMethod: 'etransfer'
  },
  {
    id: '7',
    remiteeName: 'XXX XX',
    remitAccount: '',
    remitMethod: 'cashPickup',
    receiveAmount: '12.22 PKR',
    cost: '22.33 CAD',
    status: 'awaitPayent', //waitingForPayment, sending, complete
    created: new Date(),
    etransferLink: 'https://www.youtube.com',
    paymentMethod: 'etransfer'
  },
  {
    id: '8',
    remiteeName: 'XXX XX',
    remitAccount: '',
    remitMethod: 'cashPickup',
    receiveAmount: '12.22 PKR',
    cost: '22.33 CAD',
    status: 'process', //waitingForPayment, sending, complete
    created: new Date(),
    etransferLink: 'https://www.youtube.com',
    paymentMethod: 'etransfer'
  },
  {
    id: '9',
    remiteeName: 'XXX XX',
    remitAccount: 'NBP(****111)',
    remitMethod: 'bankAccount',
    receiveAmount: '12.22 PKR',
    cost: '22.33 CAD',
    status: 'complete', //waitingForPayment, sending, complete
    created: new Date(),
    etransferLink: 'https://www.youtube.com',
    paymentMethod: 'etransfer'
  },
  {
    id: '10',
    remiteeName: 'XXX XX',
    remitAccount: 'NBP(****111)',
    remitMethod: 'bankAccount',
    receiveAmount: '12.22 PKR',
    cost: '22.33 CAD',
    status: 'cancel', //waitingForPayment, sending, complete
    created: new Date(),
    etransferLink: 'https://www.youtube.com',
    paymentMethod: 'etransfer'
  },
  {
    id: '11',
    remiteeName: 'XXX XX',
    remitAccount: '',
    remitMethod: 'cashPickup',
    receiveAmount: '12.22 PKR',
    cost: '22.33 CAD',
    status: 'awaitPayent', //waitingForPayment, sending, complete
    created: new Date(),
    etransferLink: 'https://www.youtube.com',
    paymentMethod: 'etransfer'
  },
  {
    id: '12',
    remiteeName: 'XXX XX',
    remitAccount: '',
    remitMethod: 'cashPickup',
    receiveAmount: '12.22 PKR',
    cost: '22.33 CAD',
    status: 'process', //waitingForPayment, sending, complete
    created: new Date(),
    etransferLink: 'https://www.youtube.com',
    paymentMethod: 'etransfer'
  },
  {
    id: '13',
    remiteeName: 'XXX XX',
    remitAccount: 'NBP(****111)',
    remitMethod: 'bankAccount',
    receiveAmount: '12.22 PKR',
    cost: '22.33 CAD',
    status: 'complete', //waitingForPayment, sending, complete
    created: new Date(),
    etransferLink: 'https://www.youtube.com',
    paymentMethod: 'etransfer'
  },
  {
    id: '14',
    remiteeName: 'XXX XX',
    remitAccount: 'NBP(****111)',
    remitMethod: 'bankAccount',
    receiveAmount: '12.22 PKR',
    cost: '22.33 CAD',
    status: 'cancel', //waitingForPayment, sending, complete
    created: new Date(),
    etransferLink: 'https://www.youtube.com',
    paymentMethod: 'etransfer'
  },
  {
    id: '15',
    remiteeName: 'XXX XX',
    remitAccount: '',
    remitMethod: 'cashPickup',
    receiveAmount: '12.22 PKR',
    cost: '22.33 CAD',
    status: 'awaitPayent', //waitingForPayment, sending, complete
    created: new Date(),
    etransferLink: 'https://www.youtube.com',
    paymentMethod: 'etransfer'
  },
  {
    id: '16',
    remiteeName: 'XXX XX',
    remitAccount: '',
    remitMethod: 'cashPickup',
    receiveAmount: '12.22 PKR',
    cost: '22.33 CAD',
    status: 'process', //waitingForPayment, sending, complete
    created: new Date(),
    etransferLink: 'https://www.youtube.com',
    paymentMethod: 'etransfer'
  }
]
export default transactions