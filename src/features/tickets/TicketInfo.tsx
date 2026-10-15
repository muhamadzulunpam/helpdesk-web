import type { ReactNode } from 'react'
import { formatDateTime } from '../../lib/format'
import type { Ticket } from '../../types'
import { PriorityBadge, StatusBadge } from './Badges'

function Item({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-0.5 text-slate-900">{children}</dd>
    </div>
  )
}

export default function TicketInfo({ ticket, className = '' }: { ticket: Ticket; className?: string }) {
  return (
    <section className={`rounded-xl border border-slate-200 bg-white p-6 ${className}`}>
      <p className="font-mono text-xs text-slate-500">{ticket.code}</p>
      <h1 className="mt-1 text-xl font-bold text-slate-900">{ticket.title}</h1>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <StatusBadge status={ticket.status} />
        <PriorityBadge priority={ticket.priority} />
        {ticket.category && (
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600">
            {ticket.category.name}
          </span>
        )}
      </div>

      <p className="mt-4 whitespace-pre-wrap text-sm text-slate-700">{ticket.description}</p>

      <dl className="mt-6 grid gap-4 border-t border-slate-100 pt-4 text-sm sm:grid-cols-2">
        <Item label="Pembuat">{ticket.creator?.name ?? '-'}</Item>
        <Item label="Ditangani oleh">
          {ticket.assignee?.name ?? <span className="text-slate-400">Belum ditugaskan</span>}
        </Item>
        <Item label="Dibuat">{formatDateTime(ticket.created_at)}</Item>
        <Item label="Diperbarui">{formatDateTime(ticket.updated_at)}</Item>
        {ticket.resolved_at && <Item label="Diselesaikan">{formatDateTime(ticket.resolved_at)}</Item>}
      </dl>
    </section>
  )
}