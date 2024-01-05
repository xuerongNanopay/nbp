import { TransactionTable } from '@/components/table'
import { ToastProvider } from '@/hook/useToastAlert'

export default async function Transactions() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-6 max-sm:text-2xl max-sm:mb-3">Transactions</h1>
      <ToastProvider>
        <TransactionTable/>
      </ToastProvider>
    </div>
  )
}