import {
  NBPCard,
  RateCard,
  TransactionCard
} from '@/components/dashboard'
import { getCurrencyRate } from '@/lib/currencyRate'
import { fetchSession } from '@/lib/session'
import { getTransactionsByOwnerId } from '@/lib/transaction'
import { redirect } from 'next/navigation'

export default async function Dashboard() {
  const session = await fetchSession()
  //TODO: rethink. I don't like this.
  if(!session || !session.login) redirect('/nbp/sign_in')
  const currencyRate = await getCurrencyRate(session!, "CAD", "PKR")

  const transactions = await getTransactionsByOwnerId(session!, {from: 0, size: 10})
  return (
    <>
      <h2 className="mx-2 text-2xl max-sm:text-xl font-semibold mb-4">
        Welcome, {session?.user?.firstName}
      </h2>
      <div className="mx-2 flex max-sm:flex-col justify-evenly max-sm:items-center max-sm:justify-stretch">
        <RateCard className="w-full flex-auto sm:mr-2 max-sm:mb-4" rate={currencyRate}/>
        <NBPCard className="w-full flex-auto" />
      </div>
      <div className="mt-4 mx-2">
        <TransactionCard transactions={transactions}/>
      </div>
    </>
  )
}
