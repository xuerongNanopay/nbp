import { NotificationTable } from "@/components/table/notificationTable"

export default async function Notifications() {
  const notification: NotificationSummary = {
    id: '1',
    subject: 'Payment Initial',
    status: 'read',
    created: new Date('2013-11-11')
  }

  const notifications = Array(7).fill(null).map((_, idx): NotificationSummary => ({...notification, id:idx.toString()}))

  return (
    <div>
      <h1 className="text-4xl font-bold mb-6 max-sm:text-2xl max-sm:mb-3">Notifications</h1>
      <NotificationTable notifications={notifications}/>
    </div>
  )
}
