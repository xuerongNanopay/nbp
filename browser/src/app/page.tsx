import SignUpForm from "./components/form/signUpForm"

export default function Home() {
  return (
    <main className="bg-slate-100 min-h-screen grid place-content-center">
      <section className="w-96">
        <SignUpForm></SignUpForm>
      </section>
    </main>
  )
}
