import type { Application, ApplicationStatus } from '@/entities/application'
import type { EventDetails } from '@/entities/event'
import { applications } from '../data/applications'

export const applicationNotifications: {
  type: 'participant_removed'
  applicationId: string
  eventId: string
  userId: string
  createdAt: string
}[] = []

export function setApplicationStatus(
  application: Application,
  status: ApplicationStatus,
  now = Date.now()
) {
  application.status = status
  application.updatedAt = new Date(now).toISOString()
}

export function syncApplications(event: EventDetails, now = Date.now()) {
  const rows = applications.filter((item) => item.eventId === event.id)

  for (const item of rows) {
    if (
      event.status === 'cancelled' &&
      (item.status === 'pending' || item.status === 'confirmed')
    ) {
      setApplicationStatus(item, 'event_cancelled', now)
    } else if (
      item.status === 'pending' &&
      now >= Date.parse(event.registrationEndsAt)
    ) {
      setApplicationStatus(item, 'expired', now)
    }
  }

  event.confirmedCount = rows.filter(
    (item) => item.status === 'confirmed'
  ).length
  event.pendingCount = rows.filter((item) => item.status === 'pending').length
  event.registeredCount = event.confirmedCount + event.pendingCount

  return rows
}
