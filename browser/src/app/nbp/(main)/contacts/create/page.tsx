import { ContactForm } from "@/components/form"
import { AlertProvider } from "@/hook/useAlert"

export default function CreateContact() {
  return (
    <div className="flex justify-center mt-4">
      <AlertProvider>
        <ContactForm/>
      </AlertProvider>
    </div>
  )
}