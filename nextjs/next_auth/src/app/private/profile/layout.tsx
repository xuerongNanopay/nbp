'use client'
import { SessionProvider } from "next-auth/react"

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <SessionProvider>{children}</SessionProvider>
  )
}