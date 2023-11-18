import NextUIProvider from '@/providers/NextUIProvider'

import IconHeader  from '@/components/header/IconHeader'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // <NextUIProvider>
      <div>
        <IconHeader className="mb-8"></IconHeader>
        <div className="flex justify-center">
          {children}
        </div>
      </div>
    // </NextUIProvider>
  )
}
