'use client'

import { 
  ToastContainer, 
  toast 
} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'

import { 
  createContext, useContext
} from 'react'
import { AlertFunc } from '@/types/log'
import { LogLevel } from '@/utils/alertUtil'

function alert(logLevel: LogLevel, msg: String) {
  switch(logLevel) {
    case LogLevel.INFO:
      toast.success(msg)
      return
    case LogLevel.WARM:
      toast.warning(msg)
      return
    case LogLevel.ERROR:
      toast.error(msg)
  }
}

const alertFunc: AlertFunc = {
  warming: (msg: string) => {alert(LogLevel.WARM, msg)},
  error: (msg: string) => {alert(LogLevel.ERROR, msg)},
  info: (msg: string) => {alert(LogLevel.INFO, msg)},
  alert
}
const AlterContext = createContext<AlertFunc | null>(null)

export function ToastProvider({
  children
}: {
  children: React.ReactNode
}): React.JSX.Element {
  return (
    <>
      <AlterContext.Provider value={alertFunc}>
        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          closeOnClick={true}
          pauseOnHover={true}
          draggable={true}
          // progress={undefined}
          theme="light"
        />
        {children}
      </AlterContext.Provider>
    </>
  )
}

export const useToastAlert = () => {return useContext(AlterContext)}

