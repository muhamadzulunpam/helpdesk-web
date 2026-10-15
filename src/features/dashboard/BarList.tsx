import { Link } from 'react-router-dom'
import { formatNumber } from '../../lib/format'

export interface BarItem {
  label: string
  value: number
  to?: string // kalau diisi, labelnya menjadi tautan
}

interface BarListProps {
  title: string
  items: BarItem[]
  emptyText?: string
}

export default function BarList({ title, items, emptyText = 'Belum ada data.' }: BarListProps) {
  // Batang terpanjang = nilai terbesar; minimal 1 agar tidak membagi dengan nol
  const max = Math.max(...items.map((item) => item.value), 1)

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6">
      <h2 className="text-sm font-semibold text-slate-900">{title}</h2>

      {items.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">{emptyText}</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {items.map((item) => (
            <li key={item.label}>
              <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
                {item.to ? (
                  <Link to={item.to} className="truncate text-slate-700 hover:text-indigo-600 hover:underline">
                    {item.label}
                  </Link>
                ) : (
                  <span className="truncate text-slate-700">{item.label}</span>
                )}
                <span className="font-medium tabular-nums text-slate-900">{formatNumber(item.value)}</span>
              </div>

              {/* Batang hanya hiasan: angkanya sudah tertulis sebagai teks di atasnya */}
              <div className="h-2 rounded-full bg-slate-100" aria-hidden="true">
                <div
                  className="h-2 rounded-full bg-indigo-500"
                  style={{ width: `${(item.value / max) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}