const dateFormatter = new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' })
const dateTimeFormatter = new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' })

export function formatDate(iso: string | null): string {
  return iso ? dateFormatter.format(new Date(iso)) : '-'
}

export function formatDateTime(iso: string | null): string {
  return iso ? dateTimeFormatter.format(new Date(iso)) : '-'
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const numberFormatter = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 1 })

export function formatNumber(value: number): string {
  return numberFormatter.format(value)
}

// Jam -> "45 menit", "6,5 jam", atau "2,3 hari"
export function formatDuration(hours: number | null): string {
  if (hours === null) return '-'
  if (hours < 1) return `${formatNumber(Math.round(hours * 60))} menit`
  if (hours < 48) return `${formatNumber(hours)} jam`
  return `${formatNumber(hours / 24)} hari`
}