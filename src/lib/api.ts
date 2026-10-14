import axios from 'axios'

const TOKEN_KEY = 'helpdesk_token'

// Tempat menyimpan token login di browser
export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { Accept: 'application/json' },
})

// Setiap request otomatis membawa token kalau sudah login
api.interceptors.request.use((config) => {
  const token = tokenStorage.get()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Token ditolak server (401): hapus token yang sudah tidak berlaku
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      tokenStorage.clear()
    }
    return Promise.reject(error)
  },
)