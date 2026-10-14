import { useAuth } from '../features/auth/useAuth'

export default function DashboardPage() {
  const { user, logout } = useAuth()

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-8 text-center shadow">
        <h1 className="text-2xl font-bold text-slate-900">Halo, {user?.name}!</h1>
        <p className="mt-1 text-sm text-slate-500">{user?.email}</p>
        <p className="mt-3 text-sm text-slate-600">Peran: {user?.roles.join(', ')}</p>

        <button
          type="button"
          onClick={() => void logout()}
          className="mt-6 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Keluar
        </button>
      </div>
    </main>
  )
}