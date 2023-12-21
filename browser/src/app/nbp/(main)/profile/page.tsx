import { fetchSession } from "@/lib/session"
import { UserDetail } from "./userDetail"
import { getUserDetail } from "@/lib/user"
import { notFound } from "next/navigation"

export default async function Profile() {

  const session = await fetchSession()
  const user = await getUserDetail(session!)
  if (!user) return notFound()

  return (
    <div className="max-w-[760px] mx-auto">
      <h2 className="mx-2 text-2xl max-sm:text-xl font-semibold mb-4">{session?.user?.firstName}</h2>
      <UserDetail session={session!} user={user}/>
    </div>
  )
}