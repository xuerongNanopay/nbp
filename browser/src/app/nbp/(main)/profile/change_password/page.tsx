import { EditPasswordForm } from "@/components/form"
import { fetchSession } from "@/lib/session"
import { getUserDetail } from "@/lib/user"
import { notFound } from "next/navigation"

export default async function EditPassword() {
  const session = await fetchSession()
  const user = await getUserDetail(session!)
  if (!user) return notFound()

  return (
    <div className="max-w-sm w-full mx-auto">
      <EditPasswordForm/>
    </div>
  )
}