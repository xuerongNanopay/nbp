export default function(dateString: string): string {
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'long'}).format(new Date(dateString))
}