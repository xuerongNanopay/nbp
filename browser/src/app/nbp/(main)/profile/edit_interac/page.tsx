import { EditInteracForm } from "@/components/form"
import { fetchSession } from "@/lib/session"
import { getUserDetail } from "@/lib/user"
import { notFound } from "next/navigation"
import { AlertProvider } from "@/hook/useAlert"

export default async function EditInterac() {
  const session = await fetchSession()
  const user = await getUserDetail(session!)
  if (!user) return notFound()

  return (
    <div className="max-w-sm w-full mx-auto">
      <AlertProvider>
        <EditInteracForm/>
      </AlertProvider>
    </div>
  )
}