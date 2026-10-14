import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../features/auth/useAuth'
import FullPageMessage from './FullPageMessage'

// Halaman di dalamnya (login, register) hanya untuk yang belum login
export default function GuestRoute() {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <FullPageMessage>Memuat...</FullPageMessage>
  }

  if (user) {
    const from = (location.state as { from?: string } | null)?.from ?? '/'
    return <Navigate to={from} replace />
  }

  return <Outlet />
}