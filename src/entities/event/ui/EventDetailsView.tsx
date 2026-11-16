import Link from 'next/link'
import type { ReactNode } from 'react'
import { CITY_TIMEZONE_LABEL } from '@/shared/config/locale'
import { formatEventDate } from '@/shared/lib/date'
import type { EventDetails } from '../model/types'
import { EventLocationMap } from './EventLocationMap'
import { EventSeatsSummary } from './EventSeatsSummary'

type EventDetailsViewProps = {
  event: EventDetails
  badge: ReactNode
  aside: ReactNode
}

const cardClass = 'bg-surface rounded-card p-6'

export function EventDetailsView({
  event,
  badge,
  aside,
}: EventDetailsViewProps) {
  return (
    <>
      <header>
        <h1 className="text-title font-semibold">{event.title}</h1>
        <nav aria-label="Навигация" className="text-muted mt-2">
          <Link href="/" className="hover:text-primary">
            Мероприятия
          </Link>
          {' / '}
          <p className="hover:text-primary inline">{event.type.name}</p>
        </nav>

        <div className="mt-6">{badge}</div>
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
            </p>
            <EventLocationMap location={event.location} className="mt-4 h-64" />
          </section>

          <section className={cardClass}>
            <h2 className="text-subtitle font-semibold">Что будем делать</h2>
            <p className="text-muted mt-2 whitespace-pre-line">
              {event.description}
            </p>
          </section>

          <section className={cardClass}>
            <h2 className="text-subtitle font-semibold">Условия участия</h2>
            <p className="text-muted mt-2 whitespace-pre-line">
              {event.conditions}
            </p>
          </section>

          <section className={cardClass}>
            <p className="text-subtitle font-semibold">
              {event.organizer.name}
            </p>
            <p className="text-muted mt-1">{event.organizerContacts}</p>
          </section>
        </div>

        <aside
          className={`${cardClass} flex flex-col gap-4 lg:sticky lg:top-8`}
        >
          <EventSeatsSummary event={event} />
          {aside}
        </aside>
      </div>
    </>
  )
}
