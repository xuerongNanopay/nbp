export default function getFormattedDate(dateString: string): string {
  const date = !dateString ? new Date() : new Date(dateString)
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'long'}).format(date)
}