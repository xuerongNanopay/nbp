import { TransferForm } from "@/components/form"
import { ToastProvider } from "@/hook/useToastAlert"

export default function TransferView({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const from = searchParams['from'] as string
  const to = searchParams['to'] as string
  return (
    <>
      <div className="flex justify-center mt-4 sm:mt-16">
        <ToastProvider>
          <TransferForm/>
        </ToastProvider>
      </div>
    </>
  )
}
