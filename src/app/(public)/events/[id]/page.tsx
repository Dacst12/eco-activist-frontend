import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  availabilityConfig,
  EventLocationMap,
  EventSeatsSummary,
  getEventAvailability,
} from '@/entities/event'
import { getEvent } from '@/entities/event/api/server'
import { CITY_TIMEZONE_LABEL } from '@/shared/config/locale'
import { formatDateTime, formatEventDate } from '@/shared/lib/date'
import { Badge, Button } from '@/shared/ui'

export async function generateMetadata({
  params,
}: PageProps<'/events/[id]'>): Promise<Metadata> {
  const { id } = await params
  const event = await getEvent(id)
  return {
    title: event ? `${event.title} — Эко Активист` : 'Мероприятие не найдено',
  }
}

const cardClass = 'bg-surface rounded-card p-6'

export default async function EventPage({ params }: PageProps<'/events/[id]'>) {
  const { id } = await params
  const event = await getEvent(id)
  if (!event) notFound()

  const availability = getEventAvailability(event)
  const { action, badge, tone } = availabilityConfig[availability]

  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <header>
        <h1 className="text-title font-semibold">{event.title}</h1>
        <nav aria-label="Навигация" className="text-muted mt-2">
          <Link href="/" className="hover:text-primary">
            Мероприятия
          </Link>
          {' / '}
          <p className="hover:text-primary inline">{event.type.name}</p>
        </nav>

        <Badge tone={tone} className="mt-6 self-start">
          {badge}
        </Badge>
      </header>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_24rem]">
        <div className="flex flex-col gap-6">
          <section className={cardClass}>
            <h2 className="text-subtitle font-semibold">
              {formatEventDate(event.startsAt, event.endsAt)}
            </h2>
            <p className="text-muted mt-2">
              {event.address}, район {event.district.name}
            </p>
            <p className="text-muted">
              {event.meetingPoint && `Точка сбора: ${event.meetingPoint}. `}
              Время: {CITY_TIMEZONE_LABEL}.
            </p>
            <EventLocationMap location={event.location} className="mt-4 h-64" />
          </section>

          <section className={cardClass}>
            <h2 className="text-subtitle font-semibold">Что будем делать</h2>
            <p className="text-muted mt-2 whitespace-pre-line">
              {event.description}
            </p>
          </section>

          {event.inventory.length > 0 && (
            <section className={cardClass}>
              <h2 className="text-subtitle font-semibold">Условия участия</h2>
              <p className="text-muted mt-2">Возьмите с собой:</p>
              <ul className="text-muted mt-1 list-disc pl-6">
                {event.inventory.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          )}

          <section className={cardClass}>
            <p className="text-primary text-subtitle font-semibold">
              {event.organizer.name}{' '}
              <span className="text-base font-medium">· проверен</span>
            </p>
            <p className="text-muted mt-1">{event.organizerContacts}</p>
          </section>
        </div>

        <aside
          className={`${cardClass} flex flex-col gap-4 lg:sticky lg:top-8`}
        >
          <EventSeatsSummary event={event} />

          {availability === 'open' && (
            <p>
              Запись до {formatDateTime(event.registrationEndsAt)} (
              {CITY_TIMEZONE_LABEL}). Участие подтвердит организатор.
            </p>
          )}

          <Button disabled={availability !== 'open'} className="w-full">
            {action}
          </Button>
        </aside>
      </div>
    </main>
  )
}
