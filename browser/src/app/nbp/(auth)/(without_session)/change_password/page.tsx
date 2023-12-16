import ChangePasswordForm from "@/components/form/changePasswordForm"
import { validateData } from "@/lib/guard"
import { ChangePasswordParamsValidator } from "@/schema/validator"
import { redirect } from "next/navigation"

export default async function ForgetPassword({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  if (!searchParams || !searchParams['email'] || !searchParams['oneTimeToken']) redirect('/nbp/sign_in')
  const email = searchParams['email'] as string
  const oneTimeToken = searchParams['oneTimeToken'] as string

  try {
    await validateData({email, oneTimeToken}, ChangePasswordParamsValidator)
  } catch(err: any) {
    redirect('/nbp/sign_in')
  }

  return (
    <div
      className="min-h-full min-w-full max-md:mt-8 max-md:px-4 md:flex md:justify-center md:items-center"
    >
      <div className="w-full flex flex-col items-center">
        <ChangePasswordForm email={email} oneTimeToken={oneTimeToken}/>
      </div>
    </div>
  )
}
