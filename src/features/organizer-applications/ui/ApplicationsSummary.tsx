import {
  attendanceClosesAt,
  attendanceWindow,
  type ApplicationList,
} from '@/entities/application'
import type { EventDetails } from '@/entities/event'
import { CITY_TIMEZONE_LABEL } from '@/shared/config/locale'
import { formatDateTime } from '@/shared/lib/date'
import { Badge } from '@/shared/ui'

type Props = {
  event: EventDetails
  list: ApplicationList
  now: number
  reviewOpen: boolean
}

export function ApplicationsSummary({ event, list, now, reviewOpen }: Props) {
  const { seats, registrationEndsAt } = list
  const phase = attendanceWindow(event, now)
  const closesAt = attendanceClosesAt(event.endsAt)

  return (
    <>
      <div className="space-y-3">
        <p className="text-subtitle font-medium">
          {event.title} · {formatDateTime(event.startsAt)}
        </p>

        {phase === 'upcoming' && (
          <Badge tone="warning">
            {reviewOpen
              ? `Рассмотреть до ${formatDateTime(registrationEndsAt)} (${CITY_TIMEZONE_LABEL})`
              : 'Рассмотрение заявок закрыто'}
          </Badge>
        )}

        {phase === 'open' && (
          <Badge tone="success">
            Отметка открыта до{' '}
            {formatDateTime(new Date(closesAt).toISOString())} (
            {CITY_TIMEZONE_LABEL})
          </Badge>
        )}

        {phase === 'closed' && <Badge tone="neutral">Отметка завершена</Badge>}

        {phase === 'unavailable' && (
          <Badge tone="neutral">Отметка недоступна</Badge>
        )}
      </div>

      <p className="font-semibold">
        Всего мест: {seats.capacity} · Подтверждено: {seats.confirmed} · Ожидают
        решения: {seats.pending} · Свободно: {seats.free}
      </p>
    </>
  )
}
