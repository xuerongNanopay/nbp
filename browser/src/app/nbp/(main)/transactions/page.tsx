import { TransactionTable } from '@/components/table'

export default async function Transactions() {

  return (
    <div>
      <h1 className="text-4xl font-bold mb-6 max-sm:text-2xl max-sm:mb-3">Transactions</h1>
      <TransactionTable/>
    </div>
  )
}