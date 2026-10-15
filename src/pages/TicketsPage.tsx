import { Link, useSearchParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import Pagination from '../components/Pagination'
import Placeholder from '../components/Placeholder'
import type { TicketFilters } from '../features/tickets/api'
import { useCategories, useTickets } from '../features/tickets/queries'
import TicketFilterBar from '../features/tickets/TicketFilterBar'
import TicketTable from '../features/tickets/TicketTable'
import { getErrorMessage } from '../lib/errors'


export default function TicketsPage() {
  // Filter dan halaman disimpan di URL, bukan di state biasa
  const [searchParams, setSearchParams] = useSearchParams()

  const filters: TicketFilters = {
    search: searchParams.get('search') ?? '',
    status: searchParams.get('status') ?? '',
    priority: searchParams.get('priority') ?? '',
    category_id: searchParams.get('category_id') ?? '',
    page: Math.max(1, Number(searchParams.get('page')) || 1),
  }

  const tickets = useTickets(filters)
  const categories = useCategories()

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

  return (
    <>
      <PageHeader
        title="Tiket"
        description="Daftar tiket bantuan."
        action={
          <Link
            to="/tickets/new"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Buat tiket
          </Link>
        }
      />

      <TicketFilterBar
        filters={filters}
        categories={categories.data ?? []}
        onChange={updateParams}
        onReset={() => setSearchParams({})}
      />

      {tickets.isPending && <Placeholder>Memuat tiket...</Placeholder>}

      {tickets.isError && (
        <div role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
          {getErrorMessage(tickets.error)}{' '}
          <button type="button" onClick={() => void tickets.refetch()} className="font-medium underline">
            Coba lagi
          </button>
        </div>
      )}

      {tickets.data &&
        (tickets.data.data.length === 0 ? (
          <Placeholder>Tidak ada tiket yang cocok.</Placeholder>
        ) : (
          <>
            <TicketTable tickets={tickets.data.data} dimmed={tickets.isPlaceholderData} />
            <Pagination
              page={tickets.data.meta.current_page}
              lastPage={tickets.data.meta.last_page}
              total={tickets.data.meta.total}
              from={tickets.data.meta.from}
              to={tickets.data.meta.to}
              label="tiket"
              onPageChange={(page) => updateParams({ page: String(page) })}
            />
          </>
        ))}
    </>
  )
}