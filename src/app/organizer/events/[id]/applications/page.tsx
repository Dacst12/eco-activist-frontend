import { OrganizerApplications } from '@/widgets/organizer-applications'

export default async function ApplicationsPage({
  params,
}: PageProps<'/organizer/events/[id]/applications'>) {
  const { id } = await params

  return (
    <main className="mx-auto w-full max-w-6xl space-y-5 px-4 py-8">
      <h1 className="text-title font-semibold">Заявки и участники</h1>
      <OrganizerApplications key={id} eventId={id} />
    </main>
  )
}
