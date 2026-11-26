import { attendanceWindow } from './attendance'
import type { MyEventItem } from './myEvents'

export type VolunteerQr = {
  token: string
  volunteerName: string
  event: Pick<MyEventItem['event'], 'title' | 'startsAt' | 'endsAt'>
}

export function canShowQr({ event, application }: MyEventItem, now: number) {
  const phase = attendanceWindow(event, now)

  return (
    application.status === 'confirmed' &&
    !application.attendedAt &&
    (phase === 'upcoming' || phase === 'open')
  )
}
