import { EventCard, type EventSummary } from '@/entities/event'

type EventsListProps = {
  events: EventSummary[]
}

export function EventsList({ events }: EventsListProps) {
  return (
    <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <li key={event.id} className="relative scroll-mt-8">
          <EventCard event={event} />
        </li>
      ))}
    </ul>
  )
}
