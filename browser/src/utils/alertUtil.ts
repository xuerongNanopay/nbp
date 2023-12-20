import type { AlertFunc } from "@/types/log"

export enum LogLevel {
  WARM = 'WARM',
  ERROR = 'ERROR',
  INFO = 'INFO',
  DEBUG = 'DEBUG',
  TRACE = 'TRACE',
  FATAL = 'FATAL'
}


const consoleAlert = (logLevel: LogLevel, ...args: any) => {
  switch(logLevel) {
    case LogLevel.INFO:
      console.log(...args)
      break
    case LogLevel.WARM:
      console.warn(...args)
      break
    case LogLevel.ERROR:
      console.log(...args)
  }
}

export const CONSOLE_ALERT: AlertFunc = {
  warming: (...args: any) => {
    consoleAlert(LogLevel.WARM, ...args)
  },
  error: (...args: any) => {
    consoleAlert(LogLevel.ERROR, ...args)
  },
  info: (...args: any) => {
    consoleAlert(LogLevel.INFO, ...args)
  },
  alert: consoleAlert
}