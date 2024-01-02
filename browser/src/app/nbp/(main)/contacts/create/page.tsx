import { ContactForm } from "@/components/form"
import { ToastProvider } from "@/hook/useToastAlert"

export default function CreateContact() {
  return (
    <div className="flex justify-center mt-4">
      <ToastProvider>
        <ContactForm/>
      </ToastProvider>
    </div>
  )
}