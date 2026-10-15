import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Role } from '../../types'
import {
  createUser,
  deleteUser,
  fetchUsers,
  updateUser,
  updateUserRole,
  type UpdateUserPayload,
  type UserFilters,
} from './api'

export function useUsers(filters: UserFilters) {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: () => fetchUsers(filters),
    placeholderData: keepPreviousData,
  })
}

// Setelah pengguna berubah, muat ulang daftar pengguna dan daftar agent (untuk penugasan tiket)
function useRefreshUsers() {
  const queryClient = useQueryClient()

  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ['users'] }),
      queryClient.invalidateQueries({ queryKey: ['agents'] }),
    ])
}

export function useCreateUser() {
  const refresh = useRefreshUsers()
  return useMutation({ mutationFn: createUser, onSuccess: refresh })
}

export function useUpdateUser() {
  const refresh = useRefreshUsers()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateUserPayload }) => updateUser(id, payload),
    onSuccess: refresh,
  })
}

export function useUpdateUserRole() {
  const refresh = useRefreshUsers()
  return useMutation({
    mutationFn: ({ id, role }: { id: number; role: Role }) => updateUserRole(id, role),
    onSuccess: refresh,
  })
}

export function useDeleteUser() {
  const refresh = useRefreshUsers()
  return useMutation({ mutationFn: (id: number) => deleteUser(id), onSuccess: refresh })
}