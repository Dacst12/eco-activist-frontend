'use client'

import { useState } from 'react'
import {
  useOrganizerApplications,
  type ApplicationStatus,
} from '@/entities/application'
import { useOrganizerEvent } from '@/entities/event'
import { getErrorMessage } from '@/shared/api'
import { Button } from '@/shared/ui'
import {
  ApplicationListControls,
  ApplicationsPagination,
  ApplicationsSummary,
  ApplicationsTable,
  useApplicationsTiming,
} from '@/features/organizer-applications'

export function OrganizerApplications({ eventId }: { eventId: string }) {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<ApplicationStatus>()
  const [page, setPage] = useState(1)

  const event = useOrganizerEvent(eventId)
  const list = useOrganizerApplications(eventId, {
    search: search.trim(),
    status,
    page,
    pageSize: 10,
  })

  const { now, reviewOpen, removalOpen } = useApplicationsTiming(
    event.data,
    list.refetch
  )

  const controlsProps = {
    search,
    status,
    statusCounts: list.data?.statusCounts,
    onSearchChange(value: string) {
      setSearch(value)
      setPage(1)
    },
    onStatusChange(value: ApplicationStatus | undefined) {
      setStatus(value)
      setPage(1)
    },
  }

  if (list.isError || event.isError) {
    return (
      <div className="space-y-5">
        <ApplicationListControls key="controls" {...controlsProps} />

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
    return (
      <div className="space-y-5">
        <ApplicationListControls key="controls" {...controlsProps} />
        <p role="status">Загружаем заявки…</p>
      </div>
    )
  }

  const { items, total, pageSize } = list.data
  const pages = Math.max(1, Math.ceil(total / pageSize))

  return (
    <div className="space-y-5">
      <ApplicationsSummary
        key="summary"
        event={event.data}
        list={list.data}
        now={now}
        reviewOpen={reviewOpen}
      />

      <ApplicationListControls key="controls" {...controlsProps} />

      {list.isPlaceholderData ? (
        <p role="status">Обновляем список…</p>
      ) : items.length ? (
        <ApplicationsTable
          items={items}
          event={event.data}
          now={now}
          reviewOpen={reviewOpen}
          removalOpen={removalOpen}
        />
      ) : (
        <p>
          {page > pages
            ? 'На этой странице больше нет заявок.'
            : search.trim()
              ? 'По этому имени и выбранному фильтру никого не найдено.'
              : status
                ? 'Заявок с таким статусом нет.'
                : 'Заявок пока нет.'}
        </p>
      )}

      {!list.isPlaceholderData && (
        <ApplicationsPagination page={page} pages={pages} onChange={setPage} />
      )}
    </div>
  )
}
