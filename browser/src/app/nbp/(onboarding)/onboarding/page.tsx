import OnboardingForm from "@/components/form/onboardingForm"
import { redirect } from "next/navigation"
import { fetchSession } from "@/lib/session"
import { LoginStatus } from "@prisma/client"

export default async function Onboard() {
  const session = await fetchSession()
  if ( !session || !session.login ) redirect('/nbp/sign_out')
  if ( session.login.status === LoginStatus.AWAIT_VERIFY ) {
    redirect('/nbp/verify_email')
  }
  if ( !!session.user ) {
    redirect('/nbp/dashboard')
  }
  return (
    <>
      <OnboardingForm/>
    </>
  )
}
