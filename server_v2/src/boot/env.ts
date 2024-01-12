const DEFAULT_HTTP_PORT = 3000

export const HTTP_PORT = assertENVNumber('HTTP_PORT', DEFAULT_HTTP_PORT)




// RTP CONFIGURES.
export const RTP_PAYMENT_EXPIRY_MS = assertENVNumber('RTP_PAYMENT_EXPIRY_MS', 7200000)
export const RTP_CREDITOR_NAME = assertENVString('RTP_CREDITOR_NAME', 'Payee')
export const RTP_CREDITOR_EMAIL = assertENVString('RTP_CREDITOR_NAME', 'xxx@payee.com')
export const RTP_CREDITOR_ACCOUNT_IDENTIFICATION = assertENVString('RTP_CREDITOR_ACCOUNT_IDENTIFICATION', '000-000-000000')
export const RTP_ULTIMATE_CREDITOR_NAME = assertENVString('RTP_CREDITOR_NAME', 'Payee')
export const RTP_ULTIMATE_CREDITOR_EMAIL = assertENVString('RTP_ULTIMATE_CREDITOR_EMAIL', 'xxx@payee.com')


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