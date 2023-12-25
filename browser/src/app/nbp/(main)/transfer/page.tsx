import { TransferForm } from "@/components/form"

export default function TransferView({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const from = searchParams['from'] as string
  const to = searchParams['to'] as string
  console.log(from , to)
  return (
    <>
      <div className="flex justify-center mt-4 sm:mt-16">
        {
          !!from || !!to ? 
          <TransferForm sourceAccountId={from} destinationContactId={to}/>
          : <TransferForm/>
        }
      </div>
    </>
  )
}
