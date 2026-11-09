import { getDistricts, getEventTypes } from '@/entities/dictionary/api/server'
import { parseEventFilters } from '@/entities/event'
import { getEvents } from '@/entities/event/api/server'
import {
  EventFilters,
  parseCatalogView,
  parseSelectedEvent,
} from '@/features/event-filters'
import { plural } from '@/shared/lib/plural'
import { EventsList } from '@/widgets/events-list'
import { EventsMap } from '@/widgets/events-map'

export default async function CatalogPage({ searchParams }: PageProps<'/'>) {
  const params = await searchParams
  const filters = parseEventFilters(params)
  const view = parseCatalogView(params.view)
  const selectedId = parseSelectedEvent(params.selected)

  const [events, types, districts] = await Promise.all([
    getEvents(filters),
    getEventTypes(),
    getDistricts(),
  ])

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12">
      <h1 className="text-title font-bold">Мероприятия рядом</h1>
      <p className="text-muted mt-2">
        Выберите экологическое дело и присоединитесь к команде.
      </p>

      <EventFilters
        filters={filters}
        view={view}
        types={types}
        districts={districts}
      />

      <h2 className="text-subtitle mt-6 font-semibold">
        Найдено {events.length}{' '}
        {plural(events.length, ['мероприятие', 'мероприятия', 'мероприятий'])}
      </h2>

      {events.length === 0 ? (
        <p className="text-muted mt-4">По выбранным условиям мероприятий нет</p>
      ) : view === 'map' ? (
        <EventsMap
          key={JSON.stringify(filters)}
          events={events}
          initialSelectedId={selectedId}
          className="mt-6 h-128"
        />
      ) : (
        <EventsList events={events} />
      )}
    </main>
  )
}
