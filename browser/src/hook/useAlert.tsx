'use client'

import { LogLevel } from '@/constants/log'
import { ErrorIcon } from '@/icons/ErrorIcon'
import { ExclamationIcon } from '@/icons/ExclamationIcon'
import type { AlertFunc } from '@/types/log'

import { 
  createContext, 
  useContext,
  useState,
  useEffect
} from 'react'

type AlertMSG = {
  level: LogLevel,
  msg: string,
  id: number
}

const AlertContext = createContext<AlertFunc | null>(null)

const LogLevelIcon = ({className, level}: {className: string, level: LogLevel}) => {
  switch(level) {
    case LogLevel.ERROR:
      return <ErrorIcon className={className}></ErrorIcon>
    case LogLevel.INFO:
      return <ExclamationIcon className={className}></ExclamationIcon>
    default:
      return <ErrorIcon className={className}></ErrorIcon>
  }
}
const AlertCard = ({msg, level}: AlertMSG) => {
  return (
    // {/* TODO: why tailwind is not work in this case */}
    <div
      style={{
        top: '20px',
        right: '15px',
        width: '300px',
        height: '72px',
        overflowY: 'auto',
        zIndex: 100000,
        backgroundColor: '#C3E2C2'
      }}
      className="fixed flex px-2 border-1 border-green-600 rounded-md"
    >
      {/* TODO: change icon base on Loglevel */}
      <LogLevelIcon className="me-2 flex-none self-center overflow-clip" level={level}/>
      <p
        style={{
          // height: '72px',
          // overflowY: 'auto',
        }}
        className="font-semibold self-center"
      >
        {msg}
      </p>
      {/* <p className="font-semibold">Email or Password Fail</p> */}
    </div>
  )
}

let key = 0
function getKey() {
  return key++;
}

export function AlertProvider({
  children
}: {
  children: React.ReactNode
}): React.JSX.Element {

  const [alerts, _setAlerts] = useState<AlertMSG[]>([])

  const setAlerts = (logLevel: LogLevel, msg: string) => {
    _setAlerts(pre => ([...pre, {level: logLevel, msg, id: getKey()}]))
  }

  const alertFunc: AlertFunc = {
    warming: (msg: string) => {setAlerts(LogLevel.WARMING, msg)},
    error: (msg: string) => {setAlerts(LogLevel.ERROR, msg)},
    info: (msg: string) => {setAlerts(LogLevel.INFO, msg)},
    alert: setAlerts
  }

  useEffect(() => {
    if (!alerts || alerts.length===0) return
    const timer = setTimeout(() => {
      _setAlerts([])
    }, 5*1000)
    return () => {
      clearTimeout(timer)
    }
  }, [alerts])

  console.log(alerts)

  return (
    <>
      {
        alerts.map((alert) => {
          return (<AlertCard key={alert.id} {...alert}/>)
        })
      }
      <AlertContext.Provider value={alertFunc}>
        {children}
      </AlertContext.Provider>
    </>
  )
}

export const useAlert = () => {return useContext(AlertContext)}