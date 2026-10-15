import { useState, type FormEvent } from 'react'
import FormField from '../../components/FormField'
import Modal from '../../components/Modal'
import { getErrorMessage, getFieldErrors } from '../../lib/errors'
import type { Role, User } from '../../types'
import { useAuth } from '../auth/useAuth'
import { roleOptions } from './constants'
import { useCreateUser, useUpdateUser } from './queries'

interface UserFormModalProps {
  user?: User // kosong = tambah pengguna baru
  onClose: () => void
}

export default function UserFormModal({ user, onClose }: UserFormModalProps) {
  const { user: currentUser } = useAuth()
  const isEdit = user !== undefined

  const createMutation = useCreateUser()
  const updateMutation = useUpdateUser()

  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<Role>('user')

  const error = isEdit ? updateMutation.error : createMutation.error
  const isPending = createMutation.isPending || updateMutation.isPending
  const fieldErrors = getFieldErrors(error)
  const generalError = error && Object.keys(fieldErrors).length === 0 ? getErrorMessage(error) : null

  const changingOwnPassword = isEdit && user.id === currentUser?.id && password !== ''

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    if (user) {
      updateMutation.mutate(
        {
          id: user.id,
          payload: { name: name.trim(), email: email.trim(), ...(password ? { password } : {}) },
        },
        { onSuccess: onClose },
      )
    } else {
      createMutation.mutate({ name: name.trim(), email: email.trim(), password, role }, { onSuccess: onClose })
    }
  }

  return (
    <Modal title={isEdit ? 'Ubah pengguna' : 'Tambah pengguna'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {generalError && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {generalError}
          </p>
        )}

        <FormField
          label="Nama"
          name="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          error={fieldErrors.name}
          maxLength={255}
          required
        />
        <FormField
          label="Email"
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={fieldErrors.email}
          required
        />

        <div>
          <FormField
            label={isEdit ? 'Password baru (opsional)' : 'Password'}
            name="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            error={fieldErrors.password}
            minLength={8}
            required={!isEdit}
          />
          <p className="mt-1 text-xs text-slate-500">
            {isEdit
              ? 'Kosongkan kalau tidak ingin mengganti. Mengganti password mengeluarkan pengguna ini dari semua perangkat.'
              : 'Minimal 8 karakter.'}
          </p>
          {changingOwnPassword && (
            <p className="mt-1 text-xs font-medium text-amber-700">
              Kamu mengganti password akunmu sendiri, jadi kamu akan keluar otomatis dan perlu login ulang.
            </p>
          )}
        </div>

        {!isEdit && (
          <div>
            <label htmlFor="role" className="mb-1 block text-sm font-medium text-slate-700">
              Peran
            </label>
            <select
              id="role"
              value={role}
              onChange={(event) => setRole(event.target.value as Role)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {fieldErrors.role && <p className="mt-1 text-sm text-red-600">{fieldErrors.role}</p>}
          </div>
        )}

        <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
          <button type="button" onClick={onClose} className="text-sm font-medium text-slate-600 hover:underline">
            Batal
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {isPending ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </form>
    </Modal>
  )
}