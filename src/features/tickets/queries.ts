import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { TicketStatus } from '../../types'
import {
  assignTicket,
  createComment,
  createTicketWithFiles,
  deleteAttachment,
  fetchAgents,
  fetchAttachments,
  fetchCategories,
  fetchComments,
  fetchTicket,
  fetchTickets,
  updateTicketStatus,
  uploadAttachment,
  type CreateCommentPayload,
  type TicketFilters,
} from './api'
/* ---------- Daftar ---------- */

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

/* ---------- Detail ---------- */

export function useTicket(id: number, enabled = true) {
  return useQuery({
    queryKey: ['ticket', id],
    queryFn: () => fetchTicket(id),
    enabled,
    retry: false, // 403 dan 404 tidak perlu dicoba ulang
  })
}

export function useAgents(enabled: boolean) {
  return useQuery({
    queryKey: ['agents'],
    queryFn: fetchAgents,
    enabled,
    staleTime: 5 * 60 * 1000,
  })
}

// Setelah tiket berubah, muat ulang detail dan daftar tiket
function useRefreshTicket(ticketId: number) {
  const queryClient = useQueryClient()

  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] }),
      queryClient.invalidateQueries({ queryKey: ['tickets'] }),
    ])
}

export function useUpdateStatus(ticketId: number) {
  const refresh = useRefreshTicket(ticketId)

  return useMutation({
    mutationFn: (status: TicketStatus) => updateTicketStatus(ticketId, status),
    onSuccess: refresh,
  })
}

export function useAssignTicket(ticketId: number) {
  const refresh = useRefreshTicket(ticketId)

  return useMutation({
    mutationFn: (agentId?: number) => assignTicket(ticketId, agentId),
    onSuccess: refresh,
  })
}

/* ---------- Komentar ---------- */

export function useComments(ticketId: number) {
  return useQuery({
    queryKey: ['comments', ticketId],
    queryFn: () => fetchComments(ticketId),
  })
}

export function useCreateComment(ticketId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateCommentPayload) => createComment(ticketId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['comments', ticketId] }),
  })
}

/* ---------- Lampiran ---------- */

export function useAttachments(ticketId: number) {
  return useQuery({
    queryKey: ['attachments', ticketId],
    queryFn: () => fetchAttachments(ticketId),
  })
}

export function useUploadAttachment(ticketId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (file: File) => uploadAttachment(ticketId, file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['attachments', ticketId] }),
  })
}

export function useDeleteAttachment(ticketId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteAttachment(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['attachments', ticketId] }),
  })
}

/* ---------- Buat tiket ---------- */

export function useCreateTicket() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createTicketWithFiles,
    // Daftar tiket harus dimuat ulang supaya tiket baru muncul
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tickets'] }),
  })
}