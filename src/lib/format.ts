const dateFormatter = new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' })

export function formatDate(iso: string | null): string {
  return iso ? dateFormatter.format(new Date(iso)) : '-'
}