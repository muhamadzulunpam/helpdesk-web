import { primaryRole } from '../../lib/roles'
import type { Role, User } from '../../types'
import { roleOptions } from './constants'

interface UserTableProps {
  users: User[]
  currentUserId: number
  busy: boolean
  dimmed?: boolean
  onEdit: (user: User) => void
  onRoleChange: (user: User, role: Role) => void
  onDelete: (user: User) => void
}

const headers = ['Nama', 'Email', 'Peran', 'Aksi']

export default function UserTable({
  users,
  currentUserId,
  busy,
  dimmed = false,
  onEdit,
  onRoleChange,
  onDelete,
}: UserTableProps) {
  return (
    <div
      className={`overflow-x-auto rounded-xl border border-slate-200 bg-white transition-opacity ${
        dimmed ? 'opacity-60' : ''
      }`}
    >
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
          <tr>
            {headers.map((header) => (
              <th key={header} className="whitespace-nowrap px-4 py-3">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {users.map((user) => {
            const isSelf = user.id === currentUserId

            return (
              <tr key={user.id} className="hover:bg-slate-50">
                <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900">
                  {user.name}
                  {isSelf && <span className="ml-2 text-xs font-normal text-slate-400">(kamu)</span>}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-600">{user.email}</td>
                <td className="px-4 py-3">
                  {/* Peran sendiri tidak bisa diubah dari sini, supaya admin tidak mengunci dirinya */}
                  <select
                    aria-label={`Peran ${user.name}`}
                    value={primaryRole(user)}
                    disabled={isSelf || busy}
                    onChange={(event) => onRoleChange(user, event.target.value as Role)}
                    className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm disabled:bg-slate-50 disabled:text-slate-500"
                  >
                    {roleOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <button
                    type="button"
                    onClick={() => onEdit(user)}
                    className="mr-4 text-sm font-medium text-indigo-600 hover:underline"
                  >
                    Ubah
                  </button>
                  {!isSelf && (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => onDelete(user)}
                      className="text-sm text-red-600 hover:underline disabled:opacity-60"
                    >
                      Hapus
                    </button>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}