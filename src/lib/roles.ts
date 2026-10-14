import type { Role, User } from '../types'

export const roleLabels: Record<Role, string> = {
  admin: 'Admin',
  agent: 'Agent',
  user: 'Pengguna',
}

// Urutan prioritas kalau satu user punya lebih dari satu peran
const ROLE_PRIORITY: Role[] = ['admin', 'agent', 'user']

export function primaryRole(user: User): Role {
  return ROLE_PRIORITY.find((role) => user.roles.includes(role)) ?? 'user'
}

// Tanpa daftar peran = boleh untuk semua yang sudah login
export function hasAnyRole(user: User | null, roles?: Role[]): boolean {
  if (!roles || roles.length === 0) return true
  return user !== null && user.roles.some((role) => roles.includes(role))
}