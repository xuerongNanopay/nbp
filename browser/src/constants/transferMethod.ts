import { ContactType } from "@prisma/client"

const TransferMethod = [
  {
    id: ContactType.BANK_ACCOUNT,
    name: 'Bank Account',
    value: ContactType.BANK_ACCOUNT
  },
  {
    id: ContactType.CASH_PICKUP,
    name: 'Cash Pickup',
    value: ContactType.CASH_PICKUP
  }
]
export default TransferMethod