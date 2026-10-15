import { useQuery } from '@tanstack/react-query'
import { fetchDashboardStats } from './api'

export function useDashboardStats() {
  // Tanpa staleTime: angka dimuat ulang setiap dashboard dibuka, jadi selalu segar
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: fetchDashboardStats,
  })
}