import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import NextUIProvider from '../providers/NextUIProvider'
import { fetchSession } from '@/lib/auth'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NBP',
  description: 'Generated by XRW',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextUIProvider>
          <div className="nbp">
            {children}
          </div>
        </NextUIProvider>
      </body>
    </html>
  )
}
