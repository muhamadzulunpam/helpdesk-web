import { Outlet } from 'react-router-dom'
import { useAuth } from '../features/auth/useAuth'
import { hasAnyRole } from '../lib/roles'
import ForbiddenPage from '../pages/ForbiddenPage'
import type { Role } from '../types'

// Halaman di dalamnya hanya untuk peran tertentu. Peran lain melihat halaman 403.
export default function RequireRole({ roles }: { roles: Role[] }) {
  const { user } = useAuth()
  return hasAnyRole(user, roles) ? <Outlet /> : <ForbiddenPage />
}