import { Link } from 'react-router-dom'

export default function ForbiddenPage() {
  return (
    <div className="py-16 text-center">
      <p className="text-5xl font-bold text-slate-300">403</p>
      <h1 className="mt-4 text-xl font-semibold text-slate-900">Akses ditolak</h1>
      <p className="mt-1 text-sm text-slate-500">Kamu tidak punya izin untuk membuka halaman ini.</p>
      <Link to="/" className="mt-6 inline-block text-sm font-medium text-indigo-600 hover:underline">
        Kembali ke dashboard
      </Link>
    </div>
  )
}