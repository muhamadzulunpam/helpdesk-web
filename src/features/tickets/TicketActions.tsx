import { useState } from 'react'
import { getErrorMessage, getFieldErrors } from '../../lib/errors'
import { hasAnyRole } from '../../lib/roles'
import type { Ticket } from '../../types'
import { useAuth } from '../auth/useAuth'
import { statusLabels, statusTransitions } from './constants'
import { useAgents, useAssignTicket, useUpdateStatus } from './queries'

const buttonClass =
  'rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60'

export default function TicketActions({ ticket, className = '' }: { ticket: Ticket; className?: string }) {
  const { user } = useAuth()

  const isAdmin = hasAnyRole(user, ['admin'])
  const isAgent = hasAnyRole(user, ['agent'])

  // Cermin aturan di backend (TicketPolicy)
  const canChangeStatus = isAdmin || (isAgent && ticket.assignee?.id === user?.id)
  const canTake = !isAdmin && isAgent && ticket.status === 'open' && ticket.assignee?.id !== user?.id
  const canAssign = isAdmin && ticket.status !== 'closed'

  const statusMutation = useUpdateStatus(ticket.id)
  const assignMutation = useAssignTicket(ticket.id)
  const agents = useAgents(canAssign)
  const [agentId, setAgentId] = useState(String(ticket.assignee?.id ?? ''))

  if (!canChangeStatus && !canTake && !canAssign) return null

  const nextStatuses = statusTransitions[ticket.status]
  const busy = statusMutation.isPending || assignMutation.isPending

  const error = statusMutation.error ?? assignMutation.error
  const errorMessage = error ? (Object.values(getFieldErrors(error))[0] ?? getErrorMessage(error)) : null

  return (
    <section className={`space-y-5 rounded-xl border border-slate-200 bg-white p-6 ${className}`}>
      <h2 className="text-sm font-semibold text-slate-900">Tindakan</h2>

      {errorMessage && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {errorMessage}
        </p>
      )}

      {canChangeStatus && (
        <div>
          <p className="mb-2 text-xs text-slate-500">Ubah status</p>
          {nextStatuses.length === 0 ? (
            <p className="text-sm text-slate-500">Tiket sudah ditutup.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {nextStatuses.map((status) => (
                <button
                  key={status}
                  type="button"
                  disabled={busy}
                  onClick={() => statusMutation.mutate(status)}
                  className={buttonClass}
                >
                  Ubah ke {statusLabels[status]}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {canTake && (
        <button
          type="button"
          disabled={busy}
          onClick={() => assignMutation.mutate(undefined)}
          className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          Ambil tiket
        </button>
      )}

      {canAssign && (
        <div>
          <label htmlFor="agent" className="mb-2 block text-xs text-slate-500">
            Tugaskan ke agent
          </label>
          <div className="flex gap-2">
            <select
              id="agent"
              value={agentId}
              onChange={(event) => setAgentId(event.target.value)}
              className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Pilih agent...</option>
              {agents.data?.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              disabled={busy || agentId === ''}
              onClick={() => assignMutation.mutate(Number(agentId))}
              className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              Tugaskan
            </button>
          </div>
        </div>
      )}
    </section>
  )
}