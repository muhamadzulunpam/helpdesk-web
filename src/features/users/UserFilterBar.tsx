import type { UserFilters } from './api'
import { roleOptions } from './constants'

interface UserFilterBarProps {
  filters: UserFilters
  onChange: (changes: Record<string, string>) => void
  onReset: () => void
}

const controlClass =
  'rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500'

export default function UserFilterBar({ filters, onChange, onReset }: UserFilterBarProps) {
  const hasFilters = Boolean(filters.search || filters.role)

  return (
    <div className="mb-4 flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center">
      {/* key: kolom cari ikut berubah kalau pencarian di URL berubah (misalnya tombol Back) */}
      <form
        key={filters.search}
        className="flex gap-2"
        onSubmit={(event) => {
          event.preventDefault()
          const value = String(new FormData(event.currentTarget).get('search') ?? '').trim()
          onChange({ search: value })
        }}
      >
        <input
          name="search"
          type="search"
          defaultValue={filters.search}
          placeholder="Cari nama atau email..."
          className={`${controlClass} w-full md:w-64`}
        />
        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Cari
        </button>
      </form>

      <select
        aria-label="Filter peran"
        value={filters.role}
        onChange={(event) => onChange({ role: event.target.value })}
        className={controlClass}
      >
        <option value="">Semua peran</option>
        {roleOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {hasFilters && (
        <button type="button" onClick={onReset} className="text-sm font-medium text-indigo-600 hover:underline">
          Reset filter
        </button>
      )}
    </div>
  )
}