'use client'

import { useEffect, useState } from 'react'
import {
  attendanceClosesAt,
  type MyEventsSection,
  useMyEvents,
} from '@/entities/application'
import { useSession } from '@/entities/user'
import { getErrorMessage } from '@/shared/api'
import { Button } from '@/shared/ui'
import { MyEventsResults } from './MyEventsResults'

type Props = {
  section: MyEventsSection
  preview?: boolean
}

export function MyEvents({ section, preview = false }: Props) {
  const [page, setPage] = useState(1)
  const { data: user } = useSession()
  const list = useMyEvents(user?.id, section, page)
  const { data, dataUpdatedAt, refetch } = list

  useEffect(() => {
    if (!data?.items.length) return

    const times = data.items.flatMap(({ event, application }) => {
      if (section === 'history') {
        return application.status === 'confirmed' && !application.attendedAt
          ? [attendanceClosesAt(event.endsAt)]
          : []
      }

      return [
        Date.parse(event.startsAt),
        Date.parse(event.endsAt),
        ...(application.status === 'pending'
          ? [Date.parse(event.registrationEndsAt)]
          : []),
      ]
    })

    const next = Math.min(...times.filter((time) => time > dataUpdatedAt))
    if (!Number.isFinite(next)) return

    const delay = Math.min(Math.max(0, next - Date.now()), 2_147_483_647)
    const timer = window.setTimeout(() => void refetch(), delay)

    return () => window.clearTimeout(timer)
  }, [section, data, dataUpdatedAt, refetch])

  return (
    <section className="mt-6 space-y-5">
      {list.isPending ? (
        <p role="status">Загружаем мероприятия…</p>
      ) : list.isError ? (
        <div className="space-y-2">
          <p role="alert">{getErrorMessage(list.error)}</p>
          <Button
            variant="secondary"
            disabled={list.isFetching}
            onClick={() => void list.refetch()}
          >
            Попробовать снова
          </Button>
        </div>
      ) : (
        <MyEventsResults
          data={list.data}
          asOf={list.dataUpdatedAt}
          preview={preview}
          section={section}
          onPageChange={setPage}
        />
      )}
    </section>
  )
}
