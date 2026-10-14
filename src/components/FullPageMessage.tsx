export default function FullPageMessage({ children }: { children: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50">
      <p className="text-sm text-slate-500">{children}</p>
    </main>
  )
}