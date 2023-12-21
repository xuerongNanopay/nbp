import { ContactTable, MobileContactTable } from "@/components/table"
import { getAllContactsByOwnerId } from "@/lib/contact"
import { fetchSession } from "@/lib/session"

export default async function Contacts() {
  const session = await fetchSession()
  let contacts = await getAllContactsByOwnerId(session!)
  contacts = contacts ?? []
  return (
    <div>
      <div>
        <h1 className="text-4xl font-bold mb-6 max-sm:text-2xl max-sm:mb-3">Contacts</h1>
        <ContactTable className="max-md:hidden" contacts={contacts}/>
        <MobileContactTable className="md:hidden" contacts={contacts}/>
      </div>
    </div>
  )
}
