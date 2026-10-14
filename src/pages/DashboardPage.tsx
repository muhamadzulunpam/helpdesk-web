import Placeholder from '../components/Placeholder'
import PageHeader from '../components/PageHeader'
import { useAuth } from '../features/auth/useAuth'

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <>
      <PageHeader title="Dashboard" description={`Selamat datang, ${user?.name}.`} />
      <Placeholder>Statistik tiket akan tampil di sini.</Placeholder>
    </>
  )
}