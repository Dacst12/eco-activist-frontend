import type { Metadata } from 'next'
import { CancelEventForm } from '@/features/event-editor'

export const metadata: Metadata = { title: 'Отмена мероприятия — Эко Активист' }

export default async function CancelEventPage({
  params,
}: PageProps<'/organizer/events/[id]/cancel'>) {
  const { id } = await params

  return (
    <main className="mx-auto w-fit max-w-7xl px-4 py-12">
      <CancelEventForm id={id} />
    </main>
  )
}
