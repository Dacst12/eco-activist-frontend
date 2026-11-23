import Link from 'next/link'
import type { MyEventItem } from '@/entities/application'
import { routes } from '@/shared/config/routes'
import { formatDateTime } from '@/shared/lib/date'
import { ActiveEventCard } from './ActiveEventCard'

type Props = {
  items: MyEventItem[]
  asOf: number
}

export function ActiveEventsPreview({ items, asOf }: Props) {
  const [first, ...other] = items
  if (!first) return null

  return (
    <div className="grid items-start gap-4 lg:grid-cols-[3fr_2fr]">
      <div className="min-w-0">
        <ActiveEventCard item={first} asOf={asOf} />
      </div>

      <aside className="bg-surface border-line rounded-control min-w-0 space-y-4 border p-4 sm:p-6">
        <h3 className="text-lg font-semibold">Ещё в вашем расписании</h3>

        {other.length ? (
          <ul className="divide-line divide-y">
            {other.slice(0, 3).map(({ application, event }) => (
              <li key={application.id} className="py-2">
                <Link
                  href={`/events/${encodeURIComponent(event.id)}`}
                  className="text-primary font-medium wrap-anywhere hover:underline"
                >
                  {event.title}
                </Link>
                <p className="text-muted text-sm">
                  {formatDateTime(event.startsAt)}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">Других активных записей пока нет.</p>
        )}

        {!other.length && (
          <Link
            href={routes.catalog}
            className="text-primary inline-block underline"
          >
            Найти мероприятие
          </Link>
        )}
      </aside>
    </div>
  )
}
