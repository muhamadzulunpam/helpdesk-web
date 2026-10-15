export type Role = 'admin' | 'agent' | 'user'

export interface User {
  id: number
  name: string
  email: string
  roles: Role[]
}

// Respons dari POST /auth/login dan /auth/register
export interface AuthResponse {
  user: User
  token: string
}

export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed'
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface UserSummary {
  id: number
  name: string
}

export interface Category {
  id: number
  name: string
  tickets_count?: number
}

export interface Ticket {
  id: number
  code: string
  title: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  category: Category | null
  creator: UserSummary | null
  assignee: UserSummary | null
  resolved_at: string | null
  created_at: string | null
  updated_at: string | null
}

// Bentuk respons daftar berhalaman dari Laravel
export interface Paginated<T> {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
    from: number | null
    to: number | null
  }
}
export interface Comment {
  id: number
  ticket_id: number
  body: string
  is_internal: boolean
  author: UserSummary | null
  created_at: string | null
}

export interface Attachment {
  id: number
  ticket_id: number
  comment_id: number | null
  original_name: string
  mime: string
  size: number
  uploaded_by: UserSummary | null
  download_url: string
  created_at: string | null
}
export interface DashboardStats {
  total: number
  by_status: Record<TicketStatus, number>
  by_priority: Record<TicketPriority, number>
  by_category: { category: string; total: number }[]
  unassigned: number
  created_last_7_days: number
  avg_resolution_hours: number | null
}