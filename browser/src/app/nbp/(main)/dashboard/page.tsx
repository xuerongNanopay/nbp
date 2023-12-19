import {
  NBPCard,
  RateCard,
  TransactionCard
} from '@/components/dashboard'
import { fetchSession } from '@/lib/session'

export default async function Dashboard() {
  const session = await fetchSession()
  return (
    <>
      <h2 className="mx-2 text-2xl max-sm:text-xl font-semibold mb-4">
        Welcome, {session?.user?.firstName}
      </h2>
      <div className="mx-2 flex max-sm:flex-col justify-evenly max-sm:items-center max-sm:justify-stretch">
        <RateCard className="w-full flex-auto sm:mr-2 max-sm:mb-4" rate={'TODO'}/>
        <NBPCard className="w-full flex-auto" />
      </div>
      <div className="mt-4 mx-2">
        <TransactionCard/>
      </div>
    </>
  )
}
