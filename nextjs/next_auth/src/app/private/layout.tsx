//TODO: session guard.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>{children}</div>
  )
}