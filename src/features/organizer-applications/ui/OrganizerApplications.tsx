'use client'

import { useState } from 'react'
import {
  applicationStatuses,
  applicationStatusConfig,
  useOrganizerApplications,
  type ApplicationStatus,
} from '@/entities/application'
import { useOrganizerEvent } from '@/entities/event'
import { getErrorMessage } from '@/shared/api'
import { CITY_TIMEZONE_LABEL } from '@/shared/config/locale'
import { formatDateTime } from '@/shared/lib/date'
import { Badge, Button } from '@/shared/ui'

export function OrganizerApplications({ eventId }: { eventId: string }) {
  const [status, setStatus] = useState<ApplicationStatus>()
  const [page, setPage] = useState(1)

  const event = useOrganizerEvent(eventId)
  const list = useOrganizerApplications(eventId, { status, page, pageSize: 10 })

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
  const all = Object.values(statusCounts).reduce((sum, count) => sum + count, 0)
  const filters = [undefined, ...applicationStatuses]

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

      <div
        role="group"
        aria-label="Статус заявки"
        className="flex flex-wrap gap-2"
      >
        {filters.map((value) => (
          <button
            type="button"
            key={value ?? 'all'}
            aria-pressed={value === status}
            className="rounded-control bg-surface aria-pressed:bg-primary aria-pressed:text-primary-foreground px-3 py-2"
            onClick={() => {
              setStatus(value)
              setPage(1)
            }}
          >
            {value ? applicationStatusConfig[value].label : 'Все'} (
            {value ? statusCounts[value] : all})
          </button>
        ))}
      </div>

      {items.length ? (
        <div className="lg:border-line lg:rounded-control lg:overflow-hidden lg:border">
          <table className="block w-full text-left lg:table lg:border-collapse">
            <caption className="sr-only">Заявки волонтёров</caption>

            <thead className="bg-success-soft hidden lg:table-header-group">
              <tr className="divide-line divide-x">
                {[
                  'Волонтёр',
                  'Контакт',
                  'Время подачи',
                  'Статус',
                  'Действия',
                ].map((label) => (
                  <th
                    key={label}
                    scope="col"
                    className="px-4 py-3 font-semibold"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="grid gap-3 lg:table-row-group">
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="bg-surface border-line rounded-control lg:divide-line grid min-w-0 gap-3 border p-4 lg:table-row lg:divide-x lg:rounded-none lg:border-x-0 lg:border-b-0 lg:p-0"
                >
                  <th
                    scope="row"
                    className="font-semibold wrap-anywhere lg:px-4 lg:py-3"
                  >
                    {item.volunteer.name}
                  </th>

                  <td className="wrap-anywhere lg:px-4 lg:py-3">
                    <span className="text-muted block text-sm lg:hidden">
                      Контакт
                    </span>
                    {item.volunteer.contact}
                  </td>

                  <td className="lg:px-4 lg:py-3">
                    <span className="text-muted block text-sm lg:hidden">
                      Время подачи
                    </span>
                    {formatDateTime(item.createdAt)}
                  </td>

                  <td className="lg:px-4 lg:py-3">
                    <Badge tone={applicationStatusConfig[item.status].tone}>
                      {applicationStatusConfig[item.status].label}
                    </Badge>
                  </td>

                  <td className="border-line border-t pt-3 lg:border-t-0 lg:px-4 lg:py-3">
                    {item.status === 'pending' ? (
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          disabled
                          className="rounded-control bg-primary min-h-11 flex-auto px-3 py-2 text-white disabled:opacity-60 lg:min-h-0 lg:flex-none"
                        >
                          Подтвердить
                        </button>

                        <button
                          type="button"
                          disabled
                          className="rounded-control border-danger text-danger min-h-11 flex-auto border px-3 py-2 disabled:opacity-60 lg:min-h-0 lg:flex-none"
                        >
                          Отклонить
                        </button>
                      </div>
                    ) : item.status === 'confirmed' ? (
                      <button
                        type="button"
                        disabled
                        className="rounded-control border-danger text-danger min-h-11 w-full border px-3 py-2 disabled:opacity-60 lg:min-h-0 lg:w-auto"
                      >
                        Снять с мероприятия
                      </button>
                    ) : (
                      <span className="text-muted">
                        <span className="lg:hidden">
                          Нет доступных действий
                        </span>
                        <span className="hidden lg:inline">—</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
          className="flex flex-wrap items-center gap-3"
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
