const DEFAULT_RECOVER_TOKEN_TIME_OUT_SEC = 300
export const RECOVER_TOKEN_TIME_OUT_SEC = formatENVNumber('RECOVER_TOKEN_TIME_OUT', DEFAULT_RECOVER_TOKEN_TIME_OUT_SEC)

export const JWT_SECRET = assertENVString('JWT_SECRET')

const DEFAULT_SESSION_AGE = 24 * 60 * 60
export const SESSION_AGE = formatENVNumber('SESSION_AGE', DEFAULT_SESSION_AGE)

function formatENVNumber(key: string, DEFAULT: number): number {
  const value = process.env[key]
  if (!value) return DEFAULT;
  if (isNaN(parseInt(value))) {
    console.error(`Environment variable \`${key}\` should be a number. But get: \`${key}\``)
    process.exit(1)
  }
  return parseInt(value)
}

function assertENVString(key: string): string {
  const value = process.env[key]
  if (!value) {
    console.error(`Environment variable \`${key}\` should not be EMPTY.`)
    process.exit(1)
  }
  return value
}