import axios from 'axios'

interface ApiError {
  message?: string
  errors?: Record<string, string[]>
}

// Error validasi (422) per kolom, misalnya { email: 'Email sudah dipakai.' }
export function getFieldErrors(error: unknown): Record<string, string> {
  if (axios.isAxiosError<ApiError>(error) && error.response?.status === 422) {
    const errors = error.response.data?.errors ?? {}
    return Object.fromEntries(Object.entries(errors).map(([field, messages]) => [field, messages[0]]))
  }
  return {}
}

// Pesan umum yang ramah dibaca
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiError>(error)) {
    if (!error.response) return 'Tidak bisa terhubung ke server. Coba lagi nanti.'
    if (error.response.status === 429) return 'Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi.'
    return error.response.data?.message ?? 'Terjadi kesalahan.'
  }
  return 'Terjadi kesalahan.'
}