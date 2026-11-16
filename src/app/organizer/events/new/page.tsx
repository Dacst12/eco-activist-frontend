import type { Metadata } from 'next'
import { NewEventForm } from '@/features/event-editor'
import { getDistricts, getEventTypes } from '@/entities/dictionary/api/server'

export const metadata: Metadata = { title: 'Новое мероприятие — Эко Активист' }

export default async function NewEventPage() {
  const [types, districts] = await Promise.all([
    getEventTypes(),
    getDistricts(),
  ])

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12">
      <h1 className="text-title font-semibold">Новое мероприятие</h1>
      <p className="text-muted mt-2">
        Черновик · сведения можно уточнить до публикации
      </p>

      <NewEventForm types={types} districts={districts} className="mt-6" />
    </main>
  )
}
