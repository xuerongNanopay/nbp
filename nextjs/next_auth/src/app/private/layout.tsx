//TODO: session guard.
import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/options"

import { redirect } from 'next/navigation'
import type { AuthItem } from "../api/auth/[...nextauth]/options"


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const authItem = await getServerSession(authOptions) as AuthItem

  if (!authItem) redirect('/auth/signIn')
  if (!authItem.loginItem) redirect('/auth/signIn')
  if (!authItem.loginItem.isEmailLoginVerified) redirect('/auth/verifyEmail')
  if (!authItem.realUser) redirect('/auth/onboarding')

  return (
      <div>{children}</div>
  )
}