import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/options"

import { redirect } from 'next/navigation'
import type { AuthItem } from "@/app/api/auth/[...nextauth]/options"


export default async function VerifyEmailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const authItem = await getServerSession(authOptions) as AuthItem
  console.log(authItem)

  if (!authItem) redirect('/auth/signIn')
  if (!authItem.loginItem) redirect('/auth/signIn')
  if (!!authItem.loginItem.isEmailLoginVerified) redirect('/private/profile')

  return (
      <div>{children}</div>
  )
}