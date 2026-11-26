import type { EventDetails } from '@/entities/event'
import type { Application } from './types'

type EventTime = Pick<EventDetails, 'status' | 'startsAt' | 'endsAt'>
type Registration = Pick<Application, 'status' | 'attendedAt'>

export type AttendanceStatus = 'unmarked' | 'present' | 'absent'

export type AttendanceResult = {
  result: 'marked' | 'already_marked'
  attendedAt: string
}

export function attendanceWindow(event: EventTime, now: number) {
  if (event.status === 'draft' || event.status === 'cancelled') {
    return 'unavailable'
  }

  if (now < Date.parse(event.startsAt)) return 'upcoming'

  const closesAt = Date.parse(event.endsAt) + 48 * 60 * 60 * 1000
  return now < closesAt ? 'open' : 'closed'
}

export function attendanceStatus(
  event: EventTime,
  application: Registration,
  now: number
): AttendanceStatus | null {
  const window = attendanceWindow(event, now)

  if (application.status !== 'confirmed' || window === 'unavailable') {
    return null
  }

  if (application.attendedAt) return 'present'
  return window === 'closed' ? 'absent' : 'unmarked'
}
