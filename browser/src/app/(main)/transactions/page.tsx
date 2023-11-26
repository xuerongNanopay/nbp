import TransactionTable from '@/components/table/transactionTable'
import { MobileTransactionTable } from '@/components/table'

export default async function Transactions() {
  const transaction: NBPTransactionSummary= {
    id: '1',
    remiteeName: 'Xuerong Wu',
    created: new Date(), // Or Date type
    status: 'awaitPayent',
    nbpReference: 'NP000000000000000',
    sendAmount: "22.00 CAD",
    receiveAmount: "4,520.34 PRK",
    summary: "aaa -> vvv | avvv -> ccc"
  }
  
  const transactions: NBPTransactionSummary[] = Array(44).fill(null).map((_, idx): NBPTransactionSummary => {
    return {...transaction, id: idx.toString()}
  })

  return (
    <div>
      <div>
        <h1 className="text-4xl font-bold mb-6 max-sm:text-2xl max-sm:mb-2">Transactions</h1>
        <TransactionTable className="max-md:hidden" transactions={transactions}/>
        <MobileTransactionTable className="md:hidden" transactions={transactions}/>
      </div>
    </div>
  )
}