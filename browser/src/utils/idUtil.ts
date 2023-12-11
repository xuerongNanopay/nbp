export function randSixDigits(): string {
  return `${Math.floor(100000 + Math.random() * 900000)}`
}