import { LogLevel } from "@/constants/log";
import type { AlertFunc } from "@/types/log";

const consoleAlert = (logLevel: LogLevel, msg: string) => {
  switch(logLevel) {
    case LogLevel.INFO:
      console.log(msg)
      break
    case LogLevel.WARMING:
      console.warn(msg)
      break
    case LogLevel.ERROR:
      console.log(msg)
  }
}

export const CONSOLE_ALERT: AlertFunc = {
  warming: (msg: string) => {
    consoleAlert(LogLevel.WARMING, msg)
  },
  error: (msg: string) => {
    consoleAlert(LogLevel.ERROR, msg)
  },
  info: (msg: string) => {
    consoleAlert(LogLevel.INFO, msg)
  },
  alert: consoleAlert
}