import TransactionTable from '@/components/table/transactionTable'

export default function Transactions() {
  return (
    <div>
      <div>
        <h1 className="text-4xl font-bold mb-6">Transactions</h1>
        <TransactionTable/>
      </div>
    </div>
  )
}