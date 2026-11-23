import Link from 'next/link'
import type { MyEventItem } from '@/entities/application'
import { ApplicationStatusBlock } from '@/features/event-registration'
import { CITY_TIMEZONE_LABEL } from '@/shared/config/locale'
import {
  formatDateTime,
  formatEventDate,
  toCityDateKey,
} from '@/shared/lib/date'
import { Badge, Button } from '@/shared/ui'

type Props = {
  item: MyEventItem
  asOf: number
}

export function ActiveEventCard({ item, asOf }: Props) {
  const { event, application } = item
  const started = Date.parse(event.startsAt) <= asOf
  const sameDay = toCityDateKey(event.startsAt) === toCityDateKey(event.endsAt)

  const schedule = sameDay
    ? formatEventDate(event.startsAt, event.endsAt)
    : `${formatDateTime(event.startsAt)} — ${formatDateTime(event.endsAt)}`

  return (
    <article className="bg-surface border-line rounded-control space-y-5 border p-4 sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-xl font-semibold wrap-anywhere">
          <Link
            className="hover:underline"
            href={`/events/${encodeURIComponent(event.id)}`}
          >
            {event.title}
          </Link>
        </h3>

        {started && <Badge tone="neutral">Уже идёт</Badge>}
      </div>

      <dl className="grid gap-3 sm:grid-cols-2">
        <div>
          <dt className="text-muted text-sm">Когда</dt>
          <dd>
            {schedule} ({CITY_TIMEZONE_LABEL})
          </dd>
        </div>

        <div>
          <dt className="text-muted text-sm">Где</dt>
          <dd className="wrap-anywhere">{event.address}</dd>
        </div>

        {event.meetingPoint && (
          <div className="sm:col-span-2">
            <dt className="text-muted text-sm">Место встречи</dt>
            <dd>{event.meetingPoint}</dd>
          </div>
        )}
      </dl>

      <ApplicationStatusBlock
        status={application.status}
        registrationEndsAt={event.registrationEndsAt}
      />

      {!started && (
        <Button variant="secondary" className="w-full sm:w-auto" disabled>
          Отменить участие
        </Button>
      )}
    </article>
  )
}
