import { getEvents } from '@/entities/event/api/server'
import { formatEventDate } from '@/shared/lib/date'
import { plural } from '@/shared/lib/plural'

export default async function CatalogPage() {
  const events = await getEvents()

  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-title font-bold">Мероприятия рядом</h1>
      <p className="text-muted mt-2">
        Выберите экологическое дело и присоединитесь к команде.
      </p>

      <h2 className="text-subtitle mt-12 font-semibold">
        Найдено {events.length}{' '}
        {plural(events.length, ['мероприятие', 'мероприятия', 'мероприятий'])}
      </h2>

      {events.length === 0 ? (
        <p className="text-muted mt-4">По выбранным условиям мероприятий нет</p>
      ) : (
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <li
              key={event.id}
              className="border-line bg-surface rounded-card border p-6"
            >
              <p className="font-semibold">{event.title}</p>
              <p className="text-foreground mt-2 text-sm">
                {formatEventDate(event.startsAt, event.endsAt)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
