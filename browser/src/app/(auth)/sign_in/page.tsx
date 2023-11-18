import { Link } from "@nextui-org/react"
import SignInForm from "@/components/form/signInForm"
export default function SignIn() {
  return (
    <div
      className="min-h-full min-w-full max-md:mt-8 max-md:px-4 md:flex md:justify-center md:items-center"
    >
      <div className="w-full flex flex-col items-center">
        <SignInForm forgetPWLink="/forget_password"></SignInForm>
        <div className="mt-4">Not a User Yet? <Link href="/sign_up">Create a User</Link></div>
      </div>
    </div>
  )
}
