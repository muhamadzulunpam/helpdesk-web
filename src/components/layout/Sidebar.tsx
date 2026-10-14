import { NavLink } from 'react-router-dom'
import { useAuth } from '../../features/auth/useAuth'
import { hasAnyRole } from '../../lib/roles'
import { navItems } from './navigation'

export default function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { user } = useAuth()
  const items = navItems.filter((item) => hasAnyRole(user, item.roles))

  return (
    <nav className="flex flex-col gap-1 p-4">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          onClick={onNavigate}
          className={({ isActive }) =>
            `rounded-lg px-3 py-2 text-sm font-medium ${
              isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'
            }`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}