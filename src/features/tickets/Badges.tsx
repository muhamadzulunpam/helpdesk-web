import type { TicketPriority, TicketStatus } from '../../types'
import { priorityLabels, priorityStyles, statusLabels, statusStyles } from './constants'

const base = 'inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium'

export function StatusBadge({ status }: { status: TicketStatus }) {
  return <span className={`${base} ${statusStyles[status]}`}>{statusLabels[status]}</span>
}

export function PriorityBadge({ priority }: { priority: TicketPriority }) {
  return <span className={`${base} ${priorityStyles[priority]}`}>{priorityLabels[priority]}</span>
}