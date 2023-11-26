import { ContactTable } from "@/components/table"

export default function Contacts() {
  return (
    <div>
      <div>
        <h1 className="text-4xl font-bold mb-6 max-sm:text-2xl max-sm:mb-3">Contacts</h1>
        <ContactTable/>
      </div>
    </div>
  )
}
