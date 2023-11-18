import SignInForm from "@/components/form/signInForm"
export default function SignIn() {
  return (
    <div
      className="min-h-full min-w-full max-md:mt-8 max-md:px-4 md:flex md:justify-center md:items-center"
    >
      <div className="w-full flex justify-center">
        <SignInForm></SignInForm>
        {/* <></> */}
      </div>
    </div>
  )
}
