import type { MyEventItem, MyEventsSection } from '@/entities/application'
import { applications } from '../data/applications'
import { events } from '../data/events'
import { syncApplications } from './applications'

export function listMyEvents(
  userId: string,
  section: MyEventsSection,
  now: number
) {
  const mine = new Map(
    applications
      .filter((row) => row.volunteer.id === userId)
      .map((row) => [row.eventId, row])
  )

  const rows: { item: MyEventItem; order: number }[] = []

  for (const event of events) {
    const application = mine.get(event.id)
    if (!application || event.status === 'draft') continue

    syncApplications(event, now)

    const { id, status, updatedAt } = application
    const participating = status === 'pending' || status === 'confirmed'
    const endsAt = Date.parse(event.endsAt)
    const active = participating && event.status === 'published' && now < endsAt

    if (active !== (section === 'active')) continue

    let order = Date.parse(updatedAt)
    if (active) order = Date.parse(event.startsAt)
    else if (participating) order = endsAt
    else if (status === 'expired') order = Date.parse(event.registrationEndsAt)

    rows.push({
      order,
      item: {
        application: { id, status, updatedAt },
        event: {
          id: event.id,
          title: event.title,
          status: event.status,
          startsAt: event.startsAt,
          endsAt: event.endsAt,
          address: event.address,
          meetingPoint: event.meetingPoint,
          registrationEndsAt: event.registrationEndsAt,
        },
      },
    })
  }

  rows.sort((a, b) => {
    const byTime = section === 'active' ? a.order - b.order : b.order - a.order
    return byTime || a.item.application.id.localeCompare(b.item.application.id)
  })

  return rows.map(({ item }) => item)
}
