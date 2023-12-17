import { ContactTable, MobileContactTable } from "@/components/table"
import { NBPContactSummary } from "@/type"

export default async function Contacts() {
  const contact: NBPContactSummary = {
    id: '1',
    firstName: 'Xurongaaa',
    lastName: 'Wu',
    accountSummary: 'NBP(3e32432455553333)',
    created: new Date('2023-12-12'),
    status: 'pending',
    type: 'bankAccount'
  }

  const testContacts: NBPContactSummary[] = Array(1000).fill(null).map((_, idx): NBPContactSummary => {
    return {...contact, id: idx.toString()}
  })

  return (
    <div>
      <div>
        <h1 className="text-4xl font-bold mb-6 max-sm:text-2xl max-sm:mb-3">Contacts</h1>
        <ContactTable className="max-md:hidden" contacts={testContacts}/>
        <MobileContactTable className="md:hidden" contacts={testContacts}/>
      </div>
    </div>
  )
}
