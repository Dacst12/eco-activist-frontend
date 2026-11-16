import type { Metadata } from 'next'
import { EventPreview } from '@/features/event-editor'

export const metadata: Metadata = {
  title: 'Проверка перед публикацией — Эко Активист',
}

export default async function EventPreviewPage({
  params,
}: PageProps<'/organizer/events/[id]/preview'>) {
  const { id } = await params

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12">
      <EventPreview id={id} />
    </main>
  )
}
