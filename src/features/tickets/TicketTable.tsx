import { Link } from 'react-router-dom'
import { formatDate } from '../../lib/format'
import type { Ticket } from '../../types'
import { PriorityBadge, StatusBadge } from './Badges'

interface TicketTableProps {
  tickets: Ticket[]
  dimmed?: boolean
}

const headers = ['Kode', 'Judul', 'Status', 'Prioritas', 'Pembuat', 'Ditangani', 'Dibuat']

export default function TicketTable({ tickets, dimmed = false }: TicketTableProps) {
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
          {tickets.map((ticket) => (
            <tr key={ticket.id} className="hover:bg-slate-50">
              <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-slate-500">{ticket.code}</td>
              <td className="px-4 py-3">
                <Link to={`/tickets/${ticket.id}`} className="font-medium text-slate-900 hover:text-indigo-600">
                  {ticket.title}
                </Link>
                {ticket.category && <p className="text-xs text-slate-500">{ticket.category.name}</p>}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={ticket.status} />
              </td>
              <td className="px-4 py-3">
                <PriorityBadge priority={ticket.priority} />
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-slate-600">{ticket.creator?.name ?? '-'}</td>
              <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                {ticket.assignee?.name ?? <span className="text-slate-400">Belum ditugaskan</span>}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-slate-600">{formatDate(ticket.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}