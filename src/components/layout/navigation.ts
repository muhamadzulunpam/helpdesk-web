import type { Role } from '../../types'

export interface NavItem {
  to: string
  label: string
  roles?: Role[] // kosong = semua peran
}

export const navItems: NavItem[] = [
  { to: '/', label: 'Dashboard' },
  { to: '/tickets', label: 'Tiket' },
  { to: '/users', label: 'Pengguna', roles: ['admin'] },
]