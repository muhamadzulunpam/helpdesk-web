import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { fetchCategories, fetchTickets, type TicketFilters } from './api'

export function useTickets(filters: TicketFilters) {
  return useQuery({
    // Filter masuk ke queryKey: filter berubah = data diambil ulang otomatis
    queryKey: ['tickets', filters],
    queryFn: () => fetchTickets(filters),
    // Saat pindah halaman, tampilkan data lama dulu agar tidak berkedip
    placeholderData: keepPreviousData,
  })
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000, // kategori jarang berubah
  })
}