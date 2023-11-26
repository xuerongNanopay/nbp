export function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat().format(amount) + currency
}