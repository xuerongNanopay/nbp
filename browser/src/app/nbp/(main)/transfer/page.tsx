import { TransferForm } from "@/components/form"
import { AlertProvider } from "@/hook/useAlert"

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
        {/* {
          !!from || !!to ? 
          <TransferForm sourceAccountId={from} destinationContactId={to}/>
          : <TransferForm/>
        } */}
        <AlertProvider>
          <TransferForm/>
        </AlertProvider>
      </div>
    </>
  )
}
