import type { TicketPriority, TicketStatus } from '../../types'

export const statusLabels: Record<TicketStatus, string> = {
  open: 'Terbuka',
  in_progress: 'Sedang diproses',
  resolved: 'Selesai ditangani',
  closed: 'Ditutup',
}

export const priorityLabels: Record<TicketPriority, string> = {
  low: 'Rendah',
  medium: 'Sedang',
  high: 'Tinggi',
  urgent: 'Mendesak',
}

export const statusStyles: Record<TicketStatus, string> = {
  open: 'bg-blue-50 text-blue-700',
  in_progress: 'bg-amber-50 text-amber-700',
  resolved: 'bg-green-50 text-green-700',
  closed: 'bg-slate-100 text-slate-600',
}

export const priorityStyles: Record<TicketPriority, string> = {
  low: 'bg-slate-100 text-slate-600',
  medium: 'bg-sky-50 text-sky-700',
  high: 'bg-orange-50 text-orange-700',
  urgent: 'bg-red-50 text-red-700',
}

export const statusOptions = Object.entries(statusLabels).map(([value, label]) => ({ value, label }))
export const priorityOptions = Object.entries(priorityLabels).map(([value, label]) => ({ value, label }))

// Cermin aturan perpindahan status di backend, dipakai untuk menentukan tombol yang tampil.
// Backend tetap pemutus akhir; ini hanya agar tombol yang tidak berlaku tidak muncul.
export const statusTransitions: Record<TicketStatus, TicketStatus[]> = {
  open: ['in_progress', 'closed'],
  in_progress: ['resolved', 'open'],
  resolved: ['closed', 'in_progress'],
  closed: [],
}