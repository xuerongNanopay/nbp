import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/options"

import { redirect } from 'next/navigation'
import type { AuthItem } from "@/app/api/auth/[...nextauth]/options"


export default async function ForgetPasswordLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const authItem = await getServerSession(authOptions) as AuthItem
  if (!!authItem) redirect('/private/profile')

  return (
      <div>{children}</div>
  )
}