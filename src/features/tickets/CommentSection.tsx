import { useState, type FormEvent } from 'react'
import { formatDateTime } from '../../lib/format'
import { getErrorMessage, getFieldErrors } from '../../lib/errors'
import { hasAnyRole } from '../../lib/roles'
import type { Ticket } from '../../types'
import { useAuth } from '../auth/useAuth'
import { useComments, useCreateComment } from './queries'

export default function CommentSection({ ticket, className = '' }: { ticket: Ticket; className?: string }) {
  const { user } = useAuth()
  const isStaff = hasAnyRole(user, ['admin', 'agent'])
  const isClosed = ticket.status === 'closed'

  const comments = useComments(ticket.id)
  const createComment = useCreateComment(ticket.id)

  const [body, setBody] = useState('')
  const [isInternal, setIsInternal] = useState(false)

  const fieldErrors = getFieldErrors(createComment.error)
  const formError = createComment.isError ? (fieldErrors.body ?? getErrorMessage(createComment.error)) : null

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    createComment.mutate(
      { body: body.trim(), is_internal: isStaff && isInternal },
      {
        onSuccess: () => {
          setBody('')
          setIsInternal(false)
        },
      },
    )
  }

  return (
    <section className={`rounded-xl border border-slate-200 bg-white p-6 ${className}`}>
      <h2 className="text-sm font-semibold text-slate-900">Komentar</h2>

      <div className="mt-4 space-y-4">
        {comments.isPending && <p className="text-sm text-slate-500">Memuat komentar...</p>}
        {comments.isError && <p className="text-sm text-red-600">{getErrorMessage(comments.error)}</p>}
        {comments.data?.length === 0 && <p className="text-sm text-slate-500">Belum ada komentar.</p>}

        {comments.data?.map((comment) => (
          <article
            key={comment.id}
            className={`rounded-lg p-4 ${comment.is_internal ? 'bg-amber-50' : 'bg-slate-50'}`}
          >
            <header className="flex flex-wrap items-center gap-x-2 text-xs text-slate-500">
              <span className="font-medium text-slate-900">{comment.author?.name ?? 'Pengguna dihapus'}</span>
              <span>{formatDateTime(comment.created_at)}</span>
              {comment.is_internal && (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 font-medium text-amber-800">
                  Catatan internal
                </span>
              )}
            </header>
            <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{comment.body}</p>
          </article>
        ))}
      </div>

      {isClosed ? (
        <p className="mt-6 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-500">
          Tiket sudah ditutup, komentar baru tidak bisa ditambahkan.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          <label htmlFor="comment-body" className="sr-only">
            Tulis komentar
          </label>
          <textarea
            id="comment-body"
            rows={3}
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder="Tulis komentar..."
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {formError && (
            <p role="alert" className="text-sm text-red-600">
              {formError}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3">
            {isStaff ? (
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={isInternal}
                  onChange={(event) => setIsInternal(event.target.checked)}
                />
                Catatan internal (tidak terlihat oleh pembuat tiket)
              </label>
            ) : (
              <span />
            )}

            <button
              type="submit"
              disabled={createComment.isPending || body.trim() === ''}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {createComment.isPending ? 'Mengirim...' : 'Kirim'}
            </button>
          </div>
        </form>
      )}
    </section>
  )
}