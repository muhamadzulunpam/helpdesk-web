import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FormField from '../../components/FormField'
import { getErrorMessage, getFieldErrors } from '../../lib/errors'
import { formatFileSize } from '../../lib/format'
import type { TicketPriority } from '../../types'
import { priorityOptions } from './constants'
import { ALLOWED_EXTENSIONS, MAX_FILES, validateFile } from './files'
import { useCategories, useCreateTicket } from './queries'

const controlClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500'

export default function NewTicketForm() {
  const navigate = useNavigate()
  const categories = useCategories()
  const createTicket = useCreateTicket()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [priority, setPriority] = useState<TicketPriority>('medium')
  const [files, setFiles] = useState<File[]>([])
  const [fileErrors, setFileErrors] = useState<string[]>([])

  const fieldErrors = getFieldErrors(createTicket.error)
  const generalError =
    createTicket.isError && Object.keys(fieldErrors).length === 0 ? getErrorMessage(createTicket.error) : null

  function handleFilesChange(event: ChangeEvent<HTMLInputElement>) {
    const accepted = [...files]
    const errors: string[] = []

    for (const file of Array.from(event.target.files ?? [])) {
      const problem = validateFile(file)

      if (problem) {
        errors.push(`${file.name}: ${problem}`)
      } else if (accepted.some((item) => item.name === file.name && item.size === file.size)) {
        continue // file yang sama sudah dipilih
      } else if (accepted.length >= MAX_FILES) {
        errors.push(`${file.name}: maksimal ${MAX_FILES} file`)
      } else {
        accepted.push(file)
      }
    }

    setFiles(accepted)
    setFileErrors(errors)
    event.target.value = '' // supaya file yang sama bisa dipilih lagi
  }

  function removeFile(index: number) {
    setFiles((current) => current.filter((_, position) => position !== index))
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    createTicket.mutate(
      {
        payload: {
          title: title.trim(),
          description: description.trim(),
          category_id: categoryId ? Number(categoryId) : null,
          priority,
        },
        files,
      },
      {
        onSuccess: (result) => {
          // Semua lancar: langsung ke tiket yang baru dibuat
          if (result.failedFiles.length === 0) {
            navigate(`/tickets/${result.ticket.id}`)
          }
        },
      },
    )
  }

  // Tiket jadi, tetapi sebagian lampiran gagal diunggah
  const result = createTicket.data
  if (result && result.failedFiles.length > 0) {
    return (
      <div className="max-w-2xl rounded-xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
        <p className="font-semibold">Tiket {result.ticket.code} berhasil dibuat.</p>
        <p className="mt-2">Namun lampiran berikut gagal diunggah:</p>
        <ul className="mt-1 list-inside list-disc">
          {result.failedFiles.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
        <p className="mt-2">Kamu bisa menambahkannya lagi di halaman tiket.</p>
        <Link
          to={`/tickets/${result.ticket.id}`}
          className="mt-4 inline-block rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
        >
          Buka tiket
        </Link>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl space-y-5 rounded-xl border border-slate-200 bg-white p-6"
    >
      {generalError && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {generalError}
        </p>
      )}

      <FormField
        label="Judul"
        name="title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        error={fieldErrors.title}
        maxLength={255}
        placeholder="Ringkasan singkat masalahmu"
        required
      />

      <div>
        <label htmlFor="description" className="mb-1 block text-sm font-medium text-slate-700">
          Deskripsi
        </label>
        <textarea
          id="description"
          name="description"
          rows={6}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          aria-invalid={fieldErrors.description ? true : undefined}
          placeholder="Jelaskan masalahnya: apa yang terjadi, kapan, dan langkah yang sudah dicoba."
          className={`${controlClass} ${fieldErrors.description ? 'border-red-500' : ''}`}
          required
        />
        {fieldErrors.description && <p className="mt-1 text-sm text-red-600">{fieldErrors.description}</p>}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="category" className="mb-1 block text-sm font-medium text-slate-700">
            Kategori
          </label>
          <select
            id="category"
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
            className={controlClass}
          >
            <option value="">Tanpa kategori</option>
            {categories.data?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {fieldErrors.category_id && <p className="mt-1 text-sm text-red-600">{fieldErrors.category_id}</p>}
        </div>

        <div>
          <label htmlFor="priority" className="mb-1 block text-sm font-medium text-slate-700">
            Prioritas
          </label>
          <select
            id="priority"
            value={priority}
            onChange={(event) => setPriority(event.target.value as TicketPriority)}
            className={controlClass}
          >
            {priorityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {fieldErrors.priority && <p className="mt-1 text-sm text-red-600">{fieldErrors.priority}</p>}
        </div>
      </div>

      <div>
        <p className="mb-1 text-sm font-medium text-slate-700">Lampiran (opsional)</p>
        <label className="inline-block cursor-pointer rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
          Pilih file
          <input
            type="file"
            multiple
            accept={ALLOWED_EXTENSIONS.map((extension) => `.${extension}`).join(',')}
            onChange={handleFilesChange}
            className="sr-only"
          />
        </label>
        <p className="mt-1 text-xs text-slate-500">
          {ALLOWED_EXTENSIONS.join(', ')}. Maksimal 5 MB per file, {MAX_FILES} file.
        </p>

        {fileErrors.length > 0 && (
          <ul role="alert" className="mt-2 list-inside list-disc text-sm text-red-600">
            {fileErrors.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        )}

        {files.length > 0 && (
          <ul className="mt-3 divide-y divide-slate-100 rounded-lg border border-slate-200">
            {files.map((file, index) => (
              <li key={`${file.name}-${file.size}`} className="flex items-center justify-between gap-3 px-3 py-2">
                <span className="min-w-0 truncate text-sm text-slate-700">
                  {file.name} <span className="text-xs text-slate-500">({formatFileSize(file.size)})</span>
                </span>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="shrink-0 text-sm text-red-600 hover:underline"
                >
                  Hapus
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
        <Link to="/tickets" className="text-sm font-medium text-slate-600 hover:underline">
          Batal
        </Link>
        <button
          type="submit"
          disabled={createTicket.isPending}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {createTicket.isPending ? 'Memproses...' : 'Buat tiket'}
        </button>
      </div>
    </form>
  )
}