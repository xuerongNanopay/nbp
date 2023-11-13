import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

export const metadata: Metadata = {
  title: 'Next Auth Demo'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className='min-h-screen'>{children}</body>
    </html>
  )
}
