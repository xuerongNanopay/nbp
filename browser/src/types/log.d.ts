export type AlertFunc = {
  warming: (...args: any) => void,
  error: (...args: any) => void,
  info: (...args: any) => void,
  alert: (logLevel: LogLevel, ...args: any) => void
}