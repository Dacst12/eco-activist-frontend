import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  availabilityConfig,
  EventDetailsView,
  getEventAvailability,
} from '@/entities/event'
import { getEvent } from '@/entities/event/api/server'
import { JoinEventButton } from '@/features/event-registration'
import { CITY_TIMEZONE_LABEL } from '@/shared/config/locale'
import { formatDateTime } from '@/shared/lib/date'
import { Badge } from '@/shared/ui'

export async function generateMetadata({
  params,
}: PageProps<'/events/[id]'>): Promise<Metadata> {
  const { id } = await params
  const event = await getEvent(id)
  return {
    title: event ? `${event.title} — Эко Активист` : 'Мероприятие не найдено',
  }
}

export default async function EventPage({ params }: PageProps<'/events/[id]'>) {
  const { id } = await params
  const event = await getEvent(id)
  if (!event) notFound()

  const availability = getEventAvailability(event)
  const { action, badge, tone } = availabilityConfig[availability]

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12">
      <EventDetailsView
        event={event}
        badge={<Badge tone={tone}>{badge}</Badge>}
        aside={
          <>
            {event.status === 'cancelled' && event.cancelReason && (
              <p className="text-danger">
                Причина отмены: {event.cancelReason}
              </p>
            )}

            {availability === 'open' && (
              <p>
                Запись до {formatDateTime(event.registrationEndsAt)} (
                {CITY_TIMEZONE_LABEL}). Участие подтвердит организатор.
              </p>
            )}

            <JoinEventButton
              eventId={event.id}
              label={action}
              open={availability === 'open'}
              className="w-full"
            />
          </>
        }
      />
    </main>
  )
}
