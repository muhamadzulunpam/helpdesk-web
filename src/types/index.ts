export type Role = 'admin' | 'agent' | 'user'

export interface User {
  id: number
  name: string
  email: string
  roles: Role[]
}

// Respons dari POST /auth/login dan /auth/register
export interface AuthResponse {
  user: User
  token: string
}