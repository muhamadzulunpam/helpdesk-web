export const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'pdf', 'txt', 'doc', 'docx']
export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB, sama dengan batas di backend
export const MAX_FILES = 5

// Mengembalikan pesan masalah, atau null kalau file boleh dipakai
export function validateFile(file: File): string | null {
  const extension = file.name.split('.').pop()?.toLowerCase() ?? ''

  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    return 'format tidak didukung'
  }
  if (file.size > MAX_FILE_SIZE) {
    return 'ukuran melebihi 5 MB'
  }
  return null
}   