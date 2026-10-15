interface PaginationProps {
  page: number
  lastPage: number
  total: number
  from: number | null
  to: number | null
  label?: string
  onPageChange: (page: number) => void
}

const buttonClass =
  'rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50'

export default function Pagination({
  page,
  lastPage,
  total,
  from,
  to,
  label = 'data',
  onPageChange,
}: PaginationProps) {
  return (
    <div className="mt-4 flex flex-col items-center justify-between gap-3 text-sm text-slate-600 sm:flex-row">
      <p>
        Menampilkan {from ?? 0}–{to ?? 0} dari {total} {label}
      </p>
      <div className="flex items-center gap-2">
        <button type="button" disabled={page <= 1} onClick={() => onPageChange(page - 1)} className={buttonClass}>
          Sebelumnya
        </button>
        <span className="px-2">
          Halaman {page} / {lastPage}
        </span>
        <button
          type="button"
          disabled={page >= lastPage}
          onClick={() => onPageChange(page + 1)}
          className={buttonClass}
        >
          Berikutnya
        </button>
      </div>
    </div>
  )
}