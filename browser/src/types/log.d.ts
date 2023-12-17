export type AlertFunc = {
  warming: (msg: string) => void,
  error: (msg: string) => void,
  info: (msg: string) => void,
  alert: (logLevel: LogLevel, msg: string) => void
}