import { redirect } from "next/navigation"

export default async function Home() {
  redirect('/nbp/dashboard')
  return <></>
}
