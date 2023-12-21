import { UpdatePasswordForm } from "@/components/form"
import { fetchSession } from "@/lib/session"
import { UserDetail } from "./userDetail"
import { getUserDetail } from "@/lib/user"
import { notFound } from "next/navigation"

export default async function Profile() {

  const session = await fetchSession()
  const user = await getUserDetail(session!)
  if (!user) return notFound()

  return (
    <div className="flex justify-center">
      {/* <UpdatePasswordForm/> */}
      <UserDetail user={user}/>
    </div>
  )
}