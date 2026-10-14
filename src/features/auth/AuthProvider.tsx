import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { api, AUTH_EXPIRED_EVENT, tokenStorage } from '../../lib/api'
import type { AuthResponse, User } from '../../types'
import { AuthContext, type LoginPayload, type RegisterPayload } from './auth-context'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  // Kalau ada token tersimpan, kita harus cek dulu ke server sebelum tahu status login
  const [isLoading, setIsLoading] = useState(() => tokenStorage.get() !== null)

  // Saat halaman dibuka: validasi token yang tersimpan
  useEffect(() => {
    if (!tokenStorage.get()) return

    let cancelled = false

    api
      .get<{ data: User }>('/auth/me')
      .then((response) => {
        if (!cancelled) setUser(response.data.data)
      })
      .catch(() => tokenStorage.clear())
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  // Token ditolak server di tengah sesi: anggap logout
  useEffect(() => {
    const handleExpired = () => setUser(null)
    window.addEventListener(AUTH_EXPIRED_EVENT, handleExpired)
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, handleExpired)
  }, [])

  const login = useCallback(async (payload: LoginPayload) => {
    const response = await api.post<AuthResponse>('/auth/login', payload)
    tokenStorage.set(response.data.token)
    setUser(response.data.user)
  }, [])

  const register = useCallback(async (payload: RegisterPayload) => {
    const response = await api.post<AuthResponse>('/auth/register', payload)
    tokenStorage.set(response.data.token)
    setUser(response.data.user)
  }, [])

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout')
    } finally {
      // Walaupun request gagal, sesi di browser tetap diakhiri
      tokenStorage.clear()
      setUser(null)
    }
  }, [])

  const value = useMemo(
    () => ({ user, isLoading, login, register, logout }),
    [user, isLoading, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}