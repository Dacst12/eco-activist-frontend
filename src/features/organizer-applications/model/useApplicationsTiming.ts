import { useEffect, useState } from 'react'
import { attendanceClosesAt } from '@/entities/application'
import type { EventDetails } from '@/entities/event'

export function useApplicationsTiming(
  event: EventDetails | undefined,
  refetch: () => void
) {
  const [now, setNow] = useState(Date.now)

  const startsAt = Date.parse(event?.startsAt ?? '')
  const deadline = Math.min(
    Date.parse(event?.registrationEndsAt ?? ''),
    startsAt
  )
  const closesAt = attendanceClosesAt(event?.endsAt ?? '')
  const nextDeadline = [deadline, startsAt, closesAt].find((time) => time > now)

  useEffect(() => {
    if (nextDeadline === undefined) return

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

  const reviewOpen = event?.status === 'published' && now < deadline
  const removalOpen = event?.status === 'published' && now < startsAt

  return { now, reviewOpen, removalOpen }
}
