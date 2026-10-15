import PageHeader from '../components/PageHeader'
import NewTicketForm from '../features/tickets/NewTicketForm'

export default function NewTicketPage() {
  return (
    <>
      <PageHeader title="Buat tiket" description="Ceritakan masalahmu, tim kami akan membantu." />
      <NewTicketForm />
    </>
  )
}