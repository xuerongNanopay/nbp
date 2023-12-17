import OnboardingForm from "@/components/form/onboardingForm"
import { redirect } from "next/navigation"
import { fetchSession } from "@/lib/session"

export default async function Onboard() {
  const session = await fetchSession()
  if ( !session || !session.login ) redirect('/nbp/sign_in')
  if ( !!session.user ) {
    redirect('/nbp/onboarding')
  }
  return (
    <>
      <OnboardingForm/>
    </>
  )
}
