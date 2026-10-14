import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useAuth } from '../../features/auth/useAuth'
import { primaryRole, roleLabels } from '../../lib/roles'
import Sidebar from './Sidebar'

function Brand() {
  return <div className="flex h-14 items-center px-6 text-lg font-bold text-indigo-600">Helpdesk</div>
}

export default function AppLayout() {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  if (!user) return null

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar tetap di layar lebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-60 border-r border-slate-200 bg-white md:block">
        <Brand />
        <Sidebar />
      </aside>

      {/* Sidebar geser di layar kecil */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-slate-900/40"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
          <aside className="absolute inset-y-0 left-0 w-60 bg-white shadow-xl">
            <Brand />
            <Sidebar onNavigate={() => setMenuOpen(false)} />
          </aside>
        </div>
      )}

      <div className="md:pl-60">
        <header className="sticky top-0 z-30 flex h-14 items-center border-b border-slate-200 bg-white px-4">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Buka menu"
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
          >
            ☰
          </button>

          <div className="ml-auto flex items-center gap-3">
            <div className="text-right leading-tight">
              <p className="text-sm font-medium text-slate-900">{user.name}</p>
              <p className="text-xs text-slate-500">{roleLabels[primaryRole(user)]}</p>
            </div>
            <button
              type="button"
              onClick={() => void logout()}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Keluar
            </button>
          </div>
        </header>

        <main className="p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}