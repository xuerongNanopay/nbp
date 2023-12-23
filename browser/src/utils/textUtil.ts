export function blurEmail(email: String) {
  const idx = email.indexOf("@")
  const e = email.substring(0, idx)
  const d = email.substring(idx+1)

  return `${e.substring(0, 4)}****@${d}`
}