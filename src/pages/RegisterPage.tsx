import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import FormField from '../components/FormField'
import { useAuth } from '../features/auth/useAuth'
import { getErrorMessage, getFieldErrors } from '../lib/errors'

export default function RegisterPage() {
  const { register } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')

  const mutation = useMutation({ mutationFn: register })
  const fieldErrors = getFieldErrors(mutation.error)
  const generalError =
    mutation.isError && Object.keys(fieldErrors).length === 0 ? getErrorMessage(mutation.error) : null

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    mutation.mutate({ name, email, password, password_confirmation: passwordConfirmation })
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 rounded-xl bg-white p-8 shadow">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Daftar</h1>
          <p className="mt-1 text-sm text-slate-500">Buat akun baru untuk mengirim tiket.</p>
        </div>

        {generalError && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {generalError}
          </p>
        )}

        <FormField
          label="Nama"
          name="name"
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          error={fieldErrors.name}
          required
        />
        <FormField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={fieldErrors.email}
          required
        />
        <FormField
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={fieldErrors.password}
          required
        />
        <FormField
          label="Ulangi password"
          name="password_confirmation"
          type="password"
          autoComplete="new-password"
          value={passwordConfirmation}
          onChange={(event) => setPasswordConfirmation(event.target.value)}
          error={fieldErrors.password_confirmation}
          required
        />

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {mutation.isPending ? 'Memproses...' : 'Daftar'}
        </button>

        <p className="text-center text-sm text-slate-500">
          Sudah punya akun?{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:underline">
            Masuk
          </Link>
        </p>
      </form>
    </main>
  )
}