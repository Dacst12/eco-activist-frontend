import { formatEventDate } from '@/shared/lib/date'
import { plural } from '@/shared/lib/plural'
import { getFreeSeats, isFull } from '../lib/seats'
import type { EventSummary } from '../model/types'
import Link from 'next/link'
import type { Route } from 'next'

type EventCardProps = { event: EventSummary; className?: string }

export function EventCard({ event }: EventCardProps) {
  const freeSeats = getFreeSeats(event)

  return (
    <article className="border-line bg-surface rounded-card flex h-full flex-col border p-5 transition-shadow hover:shadow-md">
      <p className="text-primary text-sm tracking-wide uppercase">
        {event.type.name}
      </p>
      <h3 className="text-subtitle mt-3 font-semibold">{event.title}</h3>
      <p className="mt-3">{formatEventDate(event.startsAt, event.endsAt)}</p>
      <p className="text-muted mt-3">
        {event.district.name} · {event.address}
      </p>
      <p className="text-muted mt-3 text-sm">
        {event.organizer.name} · проверен
      </p>

      <p className="mt-3 font-semibold">
        {isFull(event) ? (
          <span className="text-muted">Мест нет</span>
        ) : (
          <span className="text-primary">
            {freeSeats} {plural(freeSeats, ['место', 'места', 'мест'])} из{' '}
            {event.capacity}
          </span>
        )}
        <span> · </span>
        <Link href={`/events/${event.id}` as Route} className="text-primary">
          Подробнее →
        </Link>
      </p>
    </article>
  )
}
