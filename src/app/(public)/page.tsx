import {
  getDistricts,
  getEventTypes,
  getOrganizerOptions,
} from '@/entities/dictionary/api/server'
import { EventCard, parseEventFilters } from '@/entities/event'
import { getEvents } from '@/entities/event/api/server'
import { EventFilters, parseCatalogView } from '@/features/event-filters'
import { plural } from '@/shared/lib/plural'
import { EventsMap } from '@/widgets/events-map'

export default async function CatalogPage({ searchParams }: PageProps<'/'>) {
  const params = await searchParams
  const filters = parseEventFilters(params)
  const view = parseCatalogView(params.view)

  const [events, types, districts, organizers] = await Promise.all([
    getEvents(filters),
    getEventTypes(),
    getDistricts(),
    getOrganizerOptions(),
  ])

  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-title font-bold">Мероприятия рядом</h1>
      <p className="text-muted mt-2">
        Выберите экологическое дело и присоединитесь к команде.
      </p>

      <EventFilters
        filters={filters}
        view={view}
        types={types}
        districts={districts}
        organizers={organizers}
      />

      <h2 className="text-subtitle mt-6 font-semibold">
        Найдено {events.length}{' '}
        {plural(events.length, ['мероприятие', 'мероприятия', 'мероприятий'])}
      </h2>

      {events.length === 0 ? (
        <p className="text-muted mt-4">По выбранным условиям мероприятий нет</p>
      ) : view === 'map' ? (
        <EventsMap events={events} className="mt-4 h-128" />
      ) : (
        <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <li key={event.id}>
              <EventCard event={event} />
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
