'use client'

import { createContext, useContext } from 'react'

type AlertFunc = {
  warming: (msg: string) => void,
  error: (msg: string) => void,
  info: (msg: string) => void,
  alert: (logLevel: string, msg: string) => void
}

const AlertContext = createContext<AlertFunc | null>(null)

export function AlertProvider({
  children
}: {
  children: React.ReactNode
}): React.JSX.Element {

  const alertFunc: AlertFunc = {
    warming: (msg: string) => {console.log(msg)},
    error: (msg: string) => {console.log(msg)},
    info: (msg: string) => {console.log(msg)},
    alert: (logLevel: string, msg: string) => {}
  }
  
  return (
    <AlertContext.Provider value={alertFunc}>
      {children}
    </AlertContext.Provider>
  )
}

export const useAlert = () => {return useContext(AlertContext)}