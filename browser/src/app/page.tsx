// import SignUpForm from "../components/form/signUpForm"
// import SignInForm from "../components/form/signInForm"
// import ForgetPasswrodForm from "../components/form/forgetPasswordForm"
// import ContactForm from "../components/form/contactForm"
// import EmailVerifyForm from "../components/form/emailVerifyForm"
// import QuoteForm from "../components/form/quoteForm"
// import SubmitTransactionForm from "../components/form/submitTransactionForm"
// import TransactionTable from "../components/table/transactionTable"
// import ContactTable from "../components/table/contactTable"
// import RateCard from "../components/dashboard/rateCard"
// import NbpCard from "../components/dashboard/nbpCard"
// import OnboardingForm from "@/components/form/onboardingForm"

import {Link} from "@nextui-org/react"

export default function Home() {
  return (
    <main className="nbp">
      <section className="p-4 flex-col justify-center items-center">
        <div className="p-4 flex justify-center items-center">
          <Link href="/onboard">Go To Onboard</Link>
        </div>
        <div className="p-4 flex justify-center items-center">
          <Link href="https://www.google.com" target="_blank">Go to google</Link>
        </div>
      </section>
    </main>
  )
}
