export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen min-w-full flex flex-col md:flex-row">
      <div 
        className="bg-nbp-background max-md:h-32 flex-initial w-full md:w-5/12 lg:w-7/12 xl:w-8/12"
      >
      </div>
      <div 
        className="flex-auto"
      >
        {children}
      </div>
    </div>
  )
}
