import { Link } from "@nextui-org/react"
import SignUpForm from "@/components/form/signUpForm"
export default function ForgetPassword() {
  return (
    <div
      className="min-h-full min-w-full max-md:mt-8 max-md:px-4 md:flex md:justify-center md:items-center"
    >
      <div className="w-full flex flex-col items-center">
        <SignUpForm></SignUpForm>
        <div className="flex justify-center mt-4">
          <div>Aleady have an account? <Link href="/sign_in">Sign In</Link></div>
        </div>
      </div>
    </div>
  )
}