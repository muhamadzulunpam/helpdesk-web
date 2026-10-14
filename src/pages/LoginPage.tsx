import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import FormField from '../components/FormField'
import { useAuth } from '../features/auth/useAuth'
import { getErrorMessage, getFieldErrors } from '../lib/errors'

export default function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const mutation = useMutation({ mutationFn: login })
  const fieldErrors = getFieldErrors(mutation.error)
  const generalError =
    mutation.isError && Object.keys(fieldErrors).length === 0 ? getErrorMessage(mutation.error) : null

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    mutation.mutate({ email, password })
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 rounded-xl bg-white p-8 shadow">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Masuk</h1>
          <p className="mt-1 text-sm text-slate-500">Masuk ke akun Helpdesk-mu.</p>
        </div>

        {generalError && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {generalError}
          </p>
        )}

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
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={fieldErrors.password}
          required
        />

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {mutation.isPending ? 'Memproses...' : 'Masuk'}
        </button>

        <p className="text-center text-sm text-slate-500">
          Belum punya akun?{' '}
          <Link to="/register" className="font-medium text-indigo-600 hover:underline">
            Daftar
          </Link>
        </p>
      </form>
    </main>
  )
}