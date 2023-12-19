import type { AlertFunc } from "@/types/log";
import { LogLevel } from "./logUtil";

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