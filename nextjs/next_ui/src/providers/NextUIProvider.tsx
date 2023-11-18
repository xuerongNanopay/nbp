'use client'

import { NextUIProvider as UIProvider } from "@nextui-org/react"

export default function NextUIProvider({children}: { children: React.ReactNode }) {
  return (
    <UIProvider>
      {children}
    </UIProvider>
  )
}
