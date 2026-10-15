import { api } from '../../lib/api'
import type {
  Attachment,
  Category,
  Comment,
  Paginated,
  Ticket,
  TicketStatus,
  User,
  UserSummary,
} from '../../types'

export const PER_PAGE = 10

export interface TicketFilters {
  search: string
  status: string
  priority: string
  category_id: string
  page: number
}

export interface CreateCommentPayload {
  body: string
  is_internal: boolean
}

/* ---------- Daftar tiket dan kategori ---------- */

export async function fetchTickets(filters: TicketFilters): Promise<Paginated<Ticket>> {
  const params: Record<string, string | number> = { per_page: PER_PAGE, page: filters.page }

  // Kirim hanya filter yang diisi
  if (filters.search) params.search = filters.search
  if (filters.status) params.status = filters.status
  if (filters.priority) params.priority = filters.priority
  if (filters.category_id) params.category_id = filters.category_id

  const response = await api.get<Paginated<Ticket>>('/tickets', { params })
  return response.data
}

export async function fetchCategories(): Promise<Category[]> {
  const response = await api.get<{ data: Category[] }>('/categories')
  return response.data.data
}

/* ---------- Detail tiket ---------- */

export async function fetchTicket(id: number): Promise<Ticket> {
  const response = await api.get<{ data: Ticket }>(`/tickets/${id}`)
  return response.data.data
}

export async function updateTicketStatus(id: number, status: TicketStatus): Promise<Ticket> {
  const response = await api.patch<{ data: Ticket }>(`/tickets/${id}/status`, { status })
  return response.data.data
}

// Admin mengirim agentId; agent yang mengambil tiket untuk dirinya tidak mengirim apa pun
export async function assignTicket(id: number, agentId?: number): Promise<Ticket> {
  const body = agentId ? { assigned_to: agentId } : {}
  const response = await api.patch<{ data: Ticket }>(`/tickets/${id}/assign`, body)
  return response.data.data
}

// Daftar agent untuk pilihan penugasan (endpoint ini khusus admin)
export async function fetchAgents(): Promise<UserSummary[]> {
  const response = await api.get<{ data: User[] }>('/users', { params: { role: 'agent', per_page: 50 } })
  return response.data.data
}

/* ---------- Komentar ---------- */

export async function fetchComments(ticketId: number): Promise<Comment[]> {
  const response = await api.get<{ data: Comment[] }>(`/tickets/${ticketId}/comments`)
  return response.data.data
}

export async function createComment(ticketId: number, payload: CreateCommentPayload): Promise<Comment> {
  const response = await api.post<{ data: Comment }>(`/tickets/${ticketId}/comments`, payload)
  return response.data.data
}

/* ---------- Lampiran ---------- */

export async function fetchAttachments(ticketId: number): Promise<Attachment[]> {
  const response = await api.get<{ data: Attachment[] }>(`/tickets/${ticketId}/attachments`)
  return response.data.data
}

export async function uploadAttachment(ticketId: number, file: File): Promise<Attachment> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await api.post<{ data: Attachment }>(`/tickets/${ticketId}/attachments`, formData)
  return response.data.data
}

export async function deleteAttachment(id: number): Promise<void> {
  await api.delete(`/attachments/${id}`)
}

// File privat butuh token, jadi tidak bisa dibuka lewat link biasa:
// ambil sebagai blob lewat klien API, lalu picu unduhan di browser.
export async function downloadAttachment(attachment: Attachment): Promise<void> {
  const response = await api.get<Blob>(`/attachments/${attachment.id}/download`, { responseType: 'blob' })

  const url = URL.createObjectURL(response.data)
  const link = document.createElement('a')
  link.href = url
  link.download = attachment.original_name
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}