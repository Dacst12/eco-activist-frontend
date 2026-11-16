import type { Metadata } from 'next'
import { getDistricts, getEventTypes } from '@/entities/dictionary/api/server'
import { EditEventForm } from '@/features/event-editor'

export const metadata: Metadata = {
  title: 'Редактирование мероприятия — Эко Активист',
}

export default async function EditEventPage({
  params,
}: PageProps<'/organizer/events/[id]/edit'>) {
  const { id } = await params
  const [types, districts] = await Promise.all([
    getEventTypes(),
    getDistricts(),
  ])

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12">
      <EditEventForm id={id} types={types} districts={districts} />
    </main>
  )
}
