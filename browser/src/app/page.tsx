import SignUpForm from "./components/form/signUpForm"
import SignInForm from "./components/form/signInForm"
import ForgetPasswrodForm from "./components/form/forgetPasswordForm"
import ContactForm from "./components/form/contactForm"

export default function Home() {
  return (
    <main className="nbp min-h-screen grid place-content-center">
      <section className="w-96">
        {/* <SignUpForm></SignUpForm> */}
        {/* <SignInForm></SignInForm> */}
        {/* <ForgetPasswrodForm></ForgetPasswrodForm> */}
        <ContactForm></ContactForm>
      </section>
    </main>
  )
}
