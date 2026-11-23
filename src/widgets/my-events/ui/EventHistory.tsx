import Link from 'next/link'
import {
  applicationStatusConfig,
  type MyEventItem,
} from '@/entities/application'
import {
  CITY_TIMEZONE,
  CITY_TIMEZONE_LABEL,
  LOCALE,
} from '@/shared/config/locale'
import { Badge } from '@/shared/ui'

const eventDate = new Intl.DateTimeFormat(LOCALE, {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: CITY_TIMEZONE,
})

export function EventHistory({ items }: { items: MyEventItem[] }) {
  return (
    <div className="md:border-line md:rounded-control md:overflow-hidden md:border">
      <table className="block w-full text-left md:table md:border-collapse">
        <caption className="sr-only">История мероприятий волонтёра</caption>

        <thead className="bg-success-soft hidden md:table-header-group">
          <tr>
            {[
              'Мероприятие',
              `Дата начала (${CITY_TIMEZONE_LABEL})`,
              'Заявка',
            ].map((label) => (
              <th key={label} scope="col" className="px-4 py-3 font-medium">
                {label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="grid gap-3 md:table-row-group">
          {items.map(({ event, application }) => {
            const status = applicationStatusConfig[application.status]

            return (
              <tr
                key={application.id}
                className="bg-surface border-line rounded-control grid gap-2 border p-4 md:table-row md:border-x-0 md:border-b-0"
              >
                <th scope="row" className="font-medium md:px-4 md:py-3">
                  <Link
                    href={`/events/${encodeURIComponent(event.id)}`}
                    className="text-primary wrap-anywhere hover:underline"
                  >
                    {event.title}
                  </Link>

                  {application.status === 'confirmed' && (
                    <span className="text-muted block text-sm font-normal">
                      Мероприятие завершено
                    </span>
                  )}
                </th>

                <td className="text-muted text-sm md:px-4 md:py-3">
                  <time dateTime={event.startsAt}>
                    {eventDate.format(new Date(event.startsAt))}
                  </time>
                  <span className="md:hidden"> ({CITY_TIMEZONE_LABEL})</span>
                </td>

                <td className="md:px-4 md:py-3">
                  <Badge tone={status.tone}>{status.label}</Badge>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
