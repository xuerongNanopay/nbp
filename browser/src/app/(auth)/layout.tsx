export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen min-w-full flex flex-col md:flex-row">
      <div 
        className="border border-sky-700 max-md:h-32 flex-initial w-full md:w-5/12 lg:w-7/12 xl:w-8/12 bg-nbp-background"
      >
      </div>
      <div 
        className="flex-auto md:grid md:place-content-center border border-yellow-700"
      >
        {children}
      </div>
    </div>
  )
}
