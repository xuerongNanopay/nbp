import { MobileTransactionTable, TransactionTable } from '@/components/table'

export default async function Transactions() {

  const transaction: NBPTransactionSummary= {
    id: '1',
    sendName: 'Xuerong Wu',
    receiveName: 'vvvv tt',
    created: new Date("2023-11-26"), // Or Date type
    status: 'awaitPayent',
    nbpReference: 'NP000000000000000',
    sendAmount: "22.00 CAD",
    receiveAmount: "4,520.34 PRK",
    summary: "aaa -> vvv | avvv -> ccc"
  }
  
  const testTransactions: NBPTransactionSummary[] = Array(44).fill(null).map((_, idx): NBPTransactionSummary => {
    return {...transaction, id: idx.toString()}
  })

  const transactions = await Promise.resolve(testTransactions)

  return (
    <div>
      <h1 className="text-4xl font-bold mb-6 max-sm:text-2xl max-sm:mb-3">Transactions</h1>
      <TransactionTable className="max-md:hidden" transactions={transactions}/>
      <MobileTransactionTable className="md:hidden" transactions={transactions}/>
    </div>
  )
}