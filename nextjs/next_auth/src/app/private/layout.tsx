//TODO: session guard.
import { getServerSession } from "next-auth"
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <div>{children}</div>
  )
}