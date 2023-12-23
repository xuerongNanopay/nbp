const DEFAULT_RECOVER_TOKEN_TIME_OUT_SEC = 300
export const RECOVER_TOKEN_TIME_OUT_SEC = assertENVNumber('RECOVER_TOKEN_TIME_OUT', DEFAULT_RECOVER_TOKEN_TIME_OUT_SEC)

export const JWT_SECRET = assertENVString('JWT_SECRET')

const DEFAULT_SESSION_AGE = 24 * 60 * 60
export const SESSION_AGE = assertENVNumber('SESSION_AGE', DEFAULT_SESSION_AGE)

const DEFAULT_LOG_LEVEL = 'info'
export const LOG_LEVEL = assertENVString('LOG_LEVEL', DEFAULT_LOG_LEVEL)

export const NOTIFICATION_PAGINATION_AGE_SEC = 180 * 24 * 60 * 60 // 90 days

function assertENVNumber(key: string, DEFAULT?: number): number {
  const value = process.env[key]

  if (!value) {
    if (!DEFAULT) {
      console.error(`Environment variable \`${key}\` should not be EMPTY.`)
      process.exit(1)
    }
    return DEFAULT
  }
  if (isNaN(parseInt(value))) {
    console.error(`Environment variable \`${key}\` should be a number. But get: \`${key}\``)
    process.exit(1)
  }
  return parseInt(value)
}

function assertENVString(key: string, DEFAULT?: string): string {
  const value = process.env[key]
  if (!value) {
    if (!DEFAULT) {
      console.error(`Environment variable \`${key}\` should not be EMPTY.`)
      process.exit(1)
    }
    return DEFAULT
  }
  return value
}