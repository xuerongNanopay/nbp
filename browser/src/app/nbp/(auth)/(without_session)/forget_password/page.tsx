import { Link } from "@nextui-org/react"
import ForgetPasswrodForm from "@/components/form/forgetPasswordForm"
export default function ForgetPassword() {
  return (
    <div
      className="min-h-full min-w-full max-md:mt-8 max-md:px-4 md:flex md:justify-center md:items-center"
    >
      <div className="w-full flex flex-col items-center">
        <ForgetPasswrodForm></ForgetPasswrodForm>
        <div className="flex justify-center mt-4">
          <Link href="/nbp/sign_in">Back to Sign In</Link>
        </div>
      </div>
    </div>
  )
}
