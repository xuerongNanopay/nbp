const DEFAULT_HTTP_PORT = 3000

export const HTTP_PORT = assertENVNumber('HTTP_PORT', DEFAULT_HTTP_PORT)


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