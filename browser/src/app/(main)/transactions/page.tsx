import TransactionTable from '@/components/table/transactionTable'

export default function Transactions() {
  return (
    <div className="max-w-[1080px]">
      <h1 className="text-3xl font-bold mb-6">Transactions</h1>
      <TransactionTable/>
    </div>
  )
}