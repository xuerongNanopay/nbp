
import { notFound, redirect } from 'next/navigation'
import { TransactionDetail } from './transactionDetail'
import { getTransactionDetailByOwnerId } from '@/lib/transaction'
import { fetchSession } from '@/lib/session'

export default async function Transaction({ params: {id} }: { params: { id: string } }) {
  const transactionId = parseInt(id)
  if ( isNaN(transactionId) ) notFound()

  const session = await fetchSession()

  const transaction = await getTransactionDetailByOwnerId(session!, transactionId)
  if (!transaction) redirect('/nbp/transactions')
  return (
    <TransactionDetail transaction={transaction}/>
  )
}