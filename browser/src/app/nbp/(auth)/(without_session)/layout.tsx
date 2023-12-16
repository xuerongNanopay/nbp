import { fetchSession } from "@/lib/session"
import { redirect } from "next/navigation";

export default async function WithoutSessionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await fetchSession();
  if (!!session) redirect('/nbp/dashboard')
  return (
    <>
      {children}
    </>
  )
}