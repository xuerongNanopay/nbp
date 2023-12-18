import EmailVerifyForm from "@/components/form/emailVerifyForm"
import { redirect } from "next/navigation"
import { fetchSession } from "@/lib/session"
import { LoginStatus } from "@prisma/client"

export default async function VerifyEmail() {

  const session = await fetchSession()
  if ( !session || !session.login ) redirect('/nbp/sign_out')
  if ( session.login.status !== LoginStatus.AWAIT_VERIFY ) {
    redirect('/nbp/onboarding')
  }

  return (
    <>
      <EmailVerifyForm></EmailVerifyForm>
    </>
  )
}
