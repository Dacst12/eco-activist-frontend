'use client'

import { useEffect, useState } from 'react'
import {
  useOrganizerApplications,
  type ApplicationStatus,
} from '@/entities/application'
import { useOrganizerEvent } from '@/entities/event'
import { getErrorMessage } from '@/shared/api'
import { CITY_TIMEZONE_LABEL } from '@/shared/config/locale'
import { formatDateTime } from '@/shared/lib/date'
import { Badge, Button } from '@/shared/ui'
import { ApplicationStatusFilters } from './ApplicationStatusFilters'
import { ApplicationsTable } from './ApplicationsTable'

export function OrganizerApplications({ eventId }: { eventId: string }) {
  const [status, setStatus] = useState<ApplicationStatus>()
  const [page, setPage] = useState(1)

  const event = useOrganizerEvent(eventId)
  const list = useOrganizerApplications(eventId, { status, page, pageSize: 10 })

  const [now, setNow] = useState(Date.now)

  const startsAt = Date.parse(event.data?.startsAt ?? '')
  const deadline = Math.min(
    Date.parse(list.data?.registrationEndsAt ?? ''),
    startsAt
  )

  const nextDeadline = now < deadline ? deadline : startsAt
  const { refetch } = list

  useEffect(() => {
    if (!Number.isFinite(nextDeadline) || now >= nextDeadline) return

    const delay = Math.min(
      Math.max(0, nextDeadline - Date.now()),
      2_147_483_647
    )

    const timer = window.setTimeout(() => {
      const time = Date.now()
      setNow(time)

      if (time >= nextDeadline) void refetch()
    }, delay)

    return () => window.clearTimeout(timer)
  }, [nextDeadline, now, refetch])

  const reviewOpen = event.data?.status === 'published' && now < deadline
  const removalOpen = event.data?.status === 'published' && now < startsAt

  if (list.isError || event.isError) {
    return (
      <div className="space-y-3">
        <p role="alert">{getErrorMessage(list.error ?? event.error)}</p>
        <Button
          variant="secondary"
          onClick={() => {
            if (event.isError) void event.refetch()
            if (list.isError) void list.refetch()
          }}
        >
          Попробовать снова
        </Button>
      </div>
    )
  }

  if (!event.data || !list.data) {
    return <p role="status">Загружаем заявки…</p>
  }

  const { seats, items, total, pageSize, statusCounts, registrationEndsAt } =
    list.data

  const pages = Math.max(1, Math.ceil(total / pageSize))

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <p className="text-subtitle font-medium">
          {event.data.title} · {formatDateTime(event.data.startsAt)}
        </p>

        <Badge tone="warning">
          Рассмотреть до {formatDateTime(registrationEndsAt)} (
          {CITY_TIMEZONE_LABEL})
        </Badge>
      </div>

      <p className="font-semibold">
        Всего мест: {seats.capacity} · Подтверждено: {seats.confirmed} · Ожидают
        решения: {seats.pending} · Свободно: {seats.free}
      </p>

      <ApplicationStatusFilters
        status={status}
        statusCounts={statusCounts}
        onChange={(value) => {
          setStatus(value)
          setPage(1)
        }}
      />

      {items.length ? (
        <ApplicationsTable
          items={items}
          reviewOpen={reviewOpen}
          removalOpen={removalOpen}
        />
      ) : (
        <p>
          {page > pages
            ? 'На этой странице больше нет заявок.'
            : status
              ? 'Заявок с таким статусом нет.'
              : 'Заявок пока нет.'}
        </p>
      )}

      {(pages > 1 || page > pages) && (
        <nav
          aria-label="Страницы заявок"
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <Button
            variant="secondary"
            disabled={page === 1}
            onClick={() => setPage(Math.min(page - 1, pages))}
          >
            Назад
          </Button>

          {page <= pages && (
            <span>
              Страница {page} из {pages}
            </span>
          )}

          <Button
            variant="secondary"
            disabled={page >= pages}
            onClick={() => setPage(page + 1)}
          >
            Далее
          </Button>
        </nav>
      )}
    </div>
  )
}
