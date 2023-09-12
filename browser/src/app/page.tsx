import SignUpForm from "./components/form/signUpForm"

export default function Home() {
  return (
    <main className="nbp min-h-screen grid place-content-center">
      <section className="w-96">
        <SignUpForm></SignUpForm>
      </section>
    </main>
  )
}
