const DEFAULT_HTTP_PORT = 3000

export const HTTP_PORT = formatENVNumber('HTTP_PORT', DEFAULT_HTTP_PORT)


function formatENVNumber(key: string, DEFAULT: number): number {
  const value = process.env[key]
  if (!value) return DEFAULT;
  if (isNaN(parseInt(value))) {
    console.error(`Environment variable \`${key}\` should be a number. But get: \`${key}\``)
    process.exit(1)
  }
  return parseInt(value)
}