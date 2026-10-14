import { useQuery } from '@tanstack/react-query'
import { Route, Routes } from 'react-router-dom'
import { api } from './lib/api'

function Home() {
  // Status 401 (belum login) tetap berarti API terjangkau.
  // Yang gagal hanya kalau server mati atau CORS belum benar.
  const { data, isPending, isError } = useQuery({
    queryKey: ['api-check'],
    queryFn: async () => {
      const response = await api.get('/categories', { validateStatus: () => true })
      return response.status
    },
  })

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="rounded-xl bg-white p-8 text-center shadow">
        <h1 className="text-2xl font-bold text-slate-900">Helpdesk</h1>
        <p className="mt-2 text-sm text-slate-600">
          {isPending && 'Mengecek koneksi ke API...'}
          {isError && 'Tidak bisa terhubung ke API. Cek server dan CORS.'}
          {data !== undefined && `API terhubung (status ${data}).`}
        </p>
      </div>
    </main>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  )
}