import { Link, useParams } from 'react-router-dom'
import Placeholder from '../components/Placeholder'
import AttachmentSection from '../features/tickets/AttachmentSection'
import CommentSection from '../features/tickets/CommentSection'
import { useTicket } from '../features/tickets/queries'
import TicketActions from '../features/tickets/TicketActions'
import TicketInfo from '../features/tickets/TicketInfo'
import { getErrorMessage, getErrorStatus } from '../lib/errors'
import ForbiddenPage from './ForbiddenPage'
import NotFoundPage from './NotFoundPage'

export default function TicketDetailPage() {
  const { id } = useParams()
  const ticketId = Number(id)
  const isValidId = Number.isInteger(ticketId) && ticketId > 0

  const ticket = useTicket(ticketId, isValidId)

  if (!isValidId) return <NotFoundPage />
  if (ticket.isPending) return <Placeholder>Memuat tiket...</Placeholder>

  if (ticket.isError) {
    const status = getErrorStatus(ticket.error)
    if (status === 403) return <ForbiddenPage />
    if (status === 404) return <NotFoundPage />

    return (
      <div role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
        {getErrorMessage(ticket.error)}{' '}
        <button type="button" onClick={() => void ticket.refetch()} className="font-medium underline">
          Coba lagi
        </button>
      </div>
    )
  }

  return (
    <>
      <Link to="/tickets" className="mb-4 inline-block text-sm font-medium text-indigo-600 hover:underline">
        ← Kembali ke daftar tiket
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        <TicketInfo ticket={ticket.data} className="lg:col-span-2" />
        <TicketActions ticket={ticket.data} className="lg:col-start-3 lg:row-span-3 lg:row-start-1" />
        <AttachmentSection ticket={ticket.data} className="lg:col-span-2" />
        <CommentSection ticket={ticket.data} className="lg:col-span-2" />
      </div>
    </>
  )
}