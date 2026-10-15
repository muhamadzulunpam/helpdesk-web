import { api } from '../../lib/api'
import type { DashboardStats } from '../../types'

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const response = await api.get<{ data: DashboardStats }>('/dashboard/stats')
  return response.data.data
}