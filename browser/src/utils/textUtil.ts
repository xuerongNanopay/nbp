export function blurEmail(email: String, radius: number=4) {
  const idx = email.indexOf("@")
  const e = email.substring(0, idx)
  const d = email.substring(idx+1)

  radius = e.length < radius ? e.length >> 1 : radius

  return `${e.substring(0, radius)}****@${d}`
}

export function currencyFormatter(dollar: number, currency: string) {
  const formatter = new Intl.NumberFormat('ca-US', {
    style: 'currency',
    currency,
  })

  return formatter.format(dollar)
}