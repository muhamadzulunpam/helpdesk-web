import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import Pagination from '../components/Pagination'
import Placeholder from '../components/Placeholder'
import { useAuth } from '../features/auth/useAuth'
import type { UserFilters } from '../features/users/api'
import { useDeleteUser, useUpdateUserRole, useUsers } from '../features/users/queries'
import UserFilterBar from '../features/users/UserFilterBar'
import UserFormModal from '../features/users/UserFormModal'
import UserTable from '../features/users/UserTable'
import { getErrorMessage } from '../lib/errors'
import { roleLabels } from '../lib/roles'
import type { Role, User } from '../types'

type ModalState = { type: 'create' } | { type: 'edit'; user: User } | null

export default function UsersPage() {
  const { user: currentUser } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [modal, setModal] = useState<ModalState>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const filters: UserFilters = {
    search: searchParams.get('search') ?? '',
    role: searchParams.get('role') ?? '',
    page: Math.max(1, Number(searchParams.get('page')) || 1),
  }

  const users = useUsers(filters)
  const roleMutation = useUpdateUserRole()
  const deleteMutation = useDeleteUser()
  const busy = roleMutation.isPending || deleteMutation.isPending

  function updateParams(changes: Record<string, string>) {
    const next = new URLSearchParams(searchParams)

    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value)
      else next.delete(key)
    }

    // Filter berubah: kembali ke halaman 1
    if (!('page' in changes)) next.delete('page')

    setSearchParams(next)
  }

  function handleRoleChange(user: User, role: Role) {
    if (!window.confirm(`Ubah peran ${user.name} menjadi ${roleLabels[role]}?`)) return

    setActionError(null)
    roleMutation.mutate({ id: user.id, role }, { onError: (error) => setActionError(getErrorMessage(error)) })
  }

  function handleDelete(user: User) {
    if (!window.confirm(`Hapus pengguna "${user.name}"? Tindakan ini tidak bisa dibatalkan.`)) return

    setActionError(null)
    deleteMutation.mutate(user.id, { onError: (error) => setActionError(getErrorMessage(error)) })
  }

  return (
    <>
      <PageHeader
        title="Pengguna"
        description="Kelola akun dan peran pengguna."
        action={
          <button
            type="button"
            onClick={() => setModal({ type: 'create' })}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Tambah pengguna
          </button>
        }
      />

      <UserFilterBar filters={filters} onChange={updateParams} onReset={() => setSearchParams({})} />

      {actionError && (
        <p role="alert" className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {actionError}
        </p>
      )}

      {users.isPending && <Placeholder>Memuat pengguna...</Placeholder>}

      {users.isError && (
        <div role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
          {getErrorMessage(users.error)}{' '}
          <button type="button" onClick={() => void users.refetch()} className="font-medium underline">
            Coba lagi
          </button>
        </div>
      )}

      {users.data &&
        (users.data.data.length === 0 ? (
          <Placeholder>Tidak ada pengguna yang cocok.</Placeholder>
        ) : (
          <>
            <UserTable
              users={users.data.data}
              currentUserId={currentUser?.id ?? 0}
              busy={busy}
              dimmed={users.isPlaceholderData}
              onEdit={(user) => setModal({ type: 'edit', user })}
              onRoleChange={handleRoleChange}
              onDelete={handleDelete}
            />
            <Pagination
              page={users.data.meta.current_page}
              lastPage={users.data.meta.last_page}
              total={users.data.meta.total}
              from={users.data.meta.from}
              to={users.data.meta.to}
              label="pengguna"
              onPageChange={(page) => updateParams({ page: String(page) })}
            />
          </>
        ))}

      {modal && (
        <UserFormModal
          user={modal.type === 'edit' ? modal.user : undefined}
          onClose={() => setModal(null)}
        />
      )}
    </>
  )
}