import { api } from '../../lib/api'
import type { Category, Paginated, Ticket } from '../../types'

export const PER_PAGE = 10

export interface TicketFilters {
  search: string
  status: string
  priority: string
  category_id: string
  page: number
}

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