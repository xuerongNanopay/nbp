import { NotificationTable } from "@/components/table/notificationTable"
import { NotificationSummary } from "@/type"

export default async function Notifications() {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-5xl">
        <h1 className="text-4xl font-bold mb-6 max-sm:text-2xl max-sm:mb-3">Notifications</h1>
        <NotificationTable/>
      </div>
    </div>
  )
}
