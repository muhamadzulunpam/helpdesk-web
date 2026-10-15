import PageHeader from '../components/PageHeader'
import Placeholder from '../components/Placeholder'
import { useAuth } from '../features/auth/useAuth'
import BarList, { type BarItem } from '../features/dashboard/BarList'
import { useDashboardStats } from '../features/dashboard/queries'
import StatCard from '../features/dashboard/StatCard'
import { priorityLabels, statusLabels } from '../features/tickets/constants'
import { getErrorMessage } from '../lib/errors'
import { formatDuration, formatNumber } from '../lib/format'
import { hasAnyRole } from '../lib/roles'
import type { DashboardStats, TicketPriority, TicketStatus } from '../types'

function DashboardContent({ stats, isStaff }: { stats: DashboardStats; isStaff: boolean }) {
  const statusItems: BarItem[] = (Object.keys(statusLabels) as TicketStatus[]).map((status) => ({
    label: statusLabels[status],
    value: stats.by_status[status],
    to: `/tickets?status=${status}`,
  }))

  const priorityItems: BarItem[] = (Object.keys(priorityLabels) as TicketPriority[]).map((priority) => ({
    label: priorityLabels[priority],
    value: stats.by_priority[priority],
    to: `/tickets?priority=${priority}`,
  }))

  const categoryItems: BarItem[] = stats.by_category.map((row) => ({
    label: row.category,
    value: row.total,
  }))

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total tiket" value={formatNumber(stats.total)} />
        <StatCard
          label={isStaff ? 'Belum ditugaskan' : 'Menunggu penanganan'}
          value={formatNumber(stats.unassigned)}
          hint="Tiket terbuka tanpa penanganan"
        />
        <StatCard label="Dibuat 7 hari terakhir" value={formatNumber(stats.created_last_7_days)} />
        <StatCard
          label="Rata-rata penyelesaian"
          value={formatDuration(stats.avg_resolution_hours)}
          hint="Dari tiket yang sudah selesai"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <BarList title="Berdasarkan status" items={statusItems} />
        <BarList title="Berdasarkan prioritas" items={priorityItems} />
        <BarList title="Berdasarkan kategori" items={categoryItems} />
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const stats = useDashboardStats()
  const isStaff = hasAnyRole(user, ['admin', 'agent'])

  return (
    <>
      <PageHeader
        title="Dashboard"
        description={`Selamat datang, ${user?.name}. Angka di bawah mencakup tiket yang bisa kamu lihat.`}
      />

      {stats.isPending && <Placeholder>Memuat statistik...</Placeholder>}

      {stats.isError && (
        <div role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
          {getErrorMessage(stats.error)}{' '}
          <button type="button" onClick={() => void stats.refetch()} className="font-medium underline">
            Coba lagi
          </button>
        </div>
      )}

      {stats.data && <DashboardContent stats={stats.data} isStaff={isStaff} />}
    </>
  )
}