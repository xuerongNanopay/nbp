import SignUpForm from "./components/form/signUpForm"
import SignInForm from "./components/form/signInForm"
import ForgetPasswrodForm from "./components/form/forgetPasswordForm"
import ContactForm from "./components/form/contactForm"
import EmailVerifyForm from "./components/form/emailVerifyForm"
import OnboardingForm from "./components/form/onboardingForm"
import QuoteForm from "./components/form/quoteForm"
import SubmitTransactionForm from "./components/form/submitTransactionForm"
import TransactionTable from "./components/table/transactionTable"
import ContactTable from "./components/table/contactTable"
import RateCard from "./components/dashboard/rateCard"
import NbpCard from "./components/dashboard/nbpCard"

export default function Home() {
  return (
    <main className="nbp min-h-screen">
      aaa
      <section className="p-4 flex justify-center">
        {/* <SignUpForm></SignUpForm> */}
        {/* <SignInForm></SignInForm> */}
        {/* <ForgetPasswrodForm></ForgetPasswrodForm> */}
        {/* <ContactForm></ContactForm> */}
        {/* <UserOnboardingForm></UserOnboardingForm> */}
        {/* <EmailVerifyForm></EmailVerifyForm> */}
        {/* <QuoteForm></QuoteForm> */}
        {/* <SubmitTransactionForm quoteId="11"/> */}
        {/* <TransactionTable></TransactionTable> */}
        {/* <ContactTable></ContactTable> */}
        {/* <RateCard rate="aaa"></RateCard> */}
        <NbpCard></NbpCard>
      </section>
    </main>
  )
}
