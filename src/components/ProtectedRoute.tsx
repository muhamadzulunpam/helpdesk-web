import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../features/auth/useAuth'
import FullPageMessage from './FullPageMessage'

// Halaman di dalamnya hanya untuk yang sudah login
export default function ProtectedRoute() {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <FullPageMessage>Memuat...</FullPageMessage>
  }

  if (!user) {
    // Simpan halaman tujuan, supaya setelah login kembali ke sana
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}