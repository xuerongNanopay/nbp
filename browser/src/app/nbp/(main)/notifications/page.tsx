import { NotificationTable } from "@/components/table/notificationTable"
import { NotificationSummary } from "@/type"

export default async function Notifications() {
  const notification: NotificationSummary = {
    id: '1',
    subject: 'Payment',
    description: 'Payment Fail fffffffd asdf asdfasdf adsfasdfasdf asdfasdf asdfdsf',
    status: 'unread',
    created: new Date('2013-11-11')
  }

  const notifications = Array(47).fill(null).map((_, idx): NotificationSummary => ({...notification, id:idx.toString()}))

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold mb-6 max-sm:text-2xl max-sm:mb-3">Notifications</h1>
        <NotificationTable notifications={notifications}/>
      </div>
    </div>
  )
}
