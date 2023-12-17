'use client'

import type { AlertFunc, LogLevel } from '@/types/log'
import { 
  createContext, 
  useContext,
  useState,
  useEffect
} from 'react'

type AlertMSG = {
  level: LogLevel,
  msg: string
}

const AlertContext = createContext<AlertFunc | null>(null)

export function AlertProvider({
  children
}: {
  children: React.ReactNode
}): React.JSX.Element {

  const [alerts, setAlerts] = useState<AlertMSG[]>([])
  console.log(alerts)
  const alertFunc: AlertFunc = {
    warming: (msg: string) => {setAlerts(pre => ([...pre, {level: LogLevel.WARMING, msg}]))},
    error: (msg: string) => {setAlerts(pre => ([...pre, {level: LogLevel.ERROR, msg}]))},
    info: (msg: string) => {setAlerts(pre => ([...pre, {level: LogLevel.INFO, msg}]))},
    alert: (logLevel: LogLevel, msg: string) => {
      setAlerts(pre => ([...pre, {level: logLevel, msg}]))
    }
  }
  
  return (
    <AlertContext.Provider value={alertFunc}>
      {children}
    </AlertContext.Provider>
  )
}

export const useAlert = () => {return useContext(AlertContext)}