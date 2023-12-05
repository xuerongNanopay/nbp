import {Link} from "@nextui-org/react"

export default async function Home() {
  return (
    <main className="nbp">
      <section className="p-4 flex-col justify-center items-center">
        <div className="p-4 flex justify-center items-center">
          <Link href="/onboard">Go To Onboard</Link>
        </div>
        <div className="p-4 flex justify-center items-center">
          <Link href="https://www.google.com" target="_blank">Go to google</Link>
        </div>
        <div className="p-4 flex justify-center items-center">
          <Link href="/dashboard">Go to Dashboard</Link>
        </div>
      </section>
    </main>
  )
}
