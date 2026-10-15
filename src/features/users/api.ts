import { api } from '../../lib/api'
import type { Paginated, Role, User } from '../../types'

export const USERS_PER_PAGE = 10

export interface UserFilters {
  search: string
  role: string
  page: number
}

export interface CreateUserPayload {
  name: string
  email: string
  password: string
  role: Role
}

export interface UpdateUserPayload {
  name: string
  email: string
  password?: string // kosong = password tidak diubah
}

export async function fetchUsers(filters: UserFilters): Promise<Paginated<User>> {
  const params: Record<string, string | number> = { per_page: USERS_PER_PAGE, page: filters.page }

  if (filters.search) params.search = filters.search
  if (filters.role) params.role = filters.role

  const response = await api.get<Paginated<User>>('/users', { params })
  return response.data
}

export async function createUser(payload: CreateUserPayload): Promise<User> {
  const response = await api.post<{ data: User }>('/users', payload)
  return response.data.data
}

export async function updateUser(id: number, payload: UpdateUserPayload): Promise<User> {
  const response = await api.put<{ data: User }>(`/users/${id}`, payload)
  return response.data.data
}

export async function updateUserRole(id: number, role: Role): Promise<User> {
  const response = await api.patch<{ data: User }>(`/users/${id}/role`, { role })
  return response.data.data
}

export async function deleteUser(id: number): Promise<void> {
  await api.delete(`/users/${id}`)
}