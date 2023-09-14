import SignUpForm from "./components/form/signUpForm"
import SignInForm from "./components/form/signInForm"
import ForgetPasswrodForm from "./components/form/forgetPasswordForm"
import ContactForm from "./components/form/contactForm"
import EmailVerifyForm from "./components/form/emailVerifyForm"
import UserOnboardingForm from "./components/form/userOnboardingForm"

export default function Home() {
  return (
    <main className="nbp min-h-screen">
      <section className="p-4 w-screen flex justify-center">
        {/* <SignUpForm></SignUpForm> */}
        {/* <SignInForm></SignInForm> */}
        {/* <ForgetPasswrodForm></ForgetPasswrodForm> */}
        {/* <ContactForm></ContactForm> */}
        <UserOnboardingForm></UserOnboardingForm>
        {/* <EmailVerifyForm></EmailVerifyForm> */}
      </section>
    </main>
  )
}
