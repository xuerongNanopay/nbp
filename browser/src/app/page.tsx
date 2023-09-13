import SignUpForm from "./components/form/signUpForm"
import SignInForm from "./components/form/signInForm"

export default function Home() {
  return (
    <main className="nbp min-h-screen grid place-content-center">
      <section className="w-96">
        <SignUpForm></SignUpForm>
        {/* <SignInForm></SignInForm> */}
      </section>
    </main>
  )
}
