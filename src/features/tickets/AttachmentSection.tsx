import { useState, type ChangeEvent } from 'react'
import { formatDateTime, formatFileSize } from '../../lib/format'
import { getErrorMessage, getFieldErrors } from '../../lib/errors'
import { hasAnyRole } from '../../lib/roles'
import type { Attachment, Ticket } from '../../types'
import { useAuth } from '../auth/useAuth'
import { downloadAttachment } from './api'
import { useAttachments, useDeleteAttachment, useUploadAttachment } from './queries'

export default function AttachmentSection({ ticket, className = '' }: { ticket: Ticket; className?: string }) {
  const { user } = useAuth()
  const isAdmin = hasAnyRole(user, ['admin'])
  const isClosed = ticket.status === 'closed'

  const attachments = useAttachments(ticket.id)
  const upload = useUploadAttachment(ticket.id)
  const remove = useDeleteAttachment(ticket.id)
  const [downloadError, setDownloadError] = useState<string | null>(null)

  const uploadError = upload.isError ? (getFieldErrors(upload.error).file ?? getErrorMessage(upload.error)) : null

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (file) upload.mutate(file)
    event.target.value = '' // supaya file yang sama bisa dipilih lagi
  }

  async function handleDownload(attachment: Attachment) {
    setDownloadError(null)
    try {
      await downloadAttachment(attachment)
    } catch (error) {
      setDownloadError(getErrorMessage(error))
    }
  }

  function handleDelete(attachment: Attachment) {
    if (window.confirm(`Hapus lampiran "${attachment.original_name}"?`)) {
      remove.mutate(attachment.id)
    }
  }

  return (
    <section className={`rounded-xl border border-slate-200 bg-white p-6 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-slate-900">Lampiran</h2>

        {!isClosed && (
          <label className="cursor-pointer rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
            {upload.isPending ? 'Mengunggah...' : 'Unggah file'}
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.pdf,.txt,.doc,.docx"
              onChange={handleFileChange}
              disabled={upload.isPending}
              className="sr-only"
            />
          </label>
        )}
      </div>

      {!isClosed && (
        <p className="mt-1 text-xs text-slate-500">jpg, png, pdf, txt, doc, docx. Maksimal 5 MB.</p>
      )}

      {(uploadError || downloadError || remove.isError) && (
        <p role="alert" className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {uploadError ?? downloadError ?? getErrorMessage(remove.error)}
        </p>
      )}

      <ul className="mt-4 divide-y divide-slate-100">
        {attachments.isPending && <li className="py-2 text-sm text-slate-500">Memuat lampiran...</li>}
        {attachments.data?.length === 0 && <li className="py-2 text-sm text-slate-500">Belum ada lampiran.</li>}

        {attachments.data?.map((attachment) => {
          const canDelete = isAdmin || attachment.uploaded_by?.id === user?.id

          return (
            <li key={attachment.id} className="flex items-center justify-between gap-3 py-2">
              <div className="min-w-0">
                <button
                  type="button"
                  onClick={() => void handleDownload(attachment)}
                  className="block max-w-full truncate text-left text-sm font-medium text-indigo-600 hover:underline"
                >
                  {attachment.original_name}
                </button>
                <p className="text-xs text-slate-500">
                  {formatFileSize(attachment.size)} · {attachment.uploaded_by?.name ?? '-'} ·{' '}
                  {formatDateTime(attachment.created_at)}
                </p>
              </div>

              {canDelete && (
                <button
                  type="button"
                  disabled={remove.isPending}
                  onClick={() => handleDelete(attachment)}
                  className="shrink-0 text-sm text-red-600 hover:underline disabled:opacity-60"
                >
                  Hapus
                </button>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}