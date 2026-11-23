import type { Application, ApplicationStatus } from '@/entities/application'
import type { EventDetails } from '@/entities/event'
import { users } from './users'

const outcomes: Exclude<ApplicationStatus, 'pending'>[] = [
  'confirmed',
  'cancelled',
  'rejected',
  'removed',
  'expired',
  'event_cancelled',
]

export function createVolunteerHistory(templates: EventDetails[]) {
  const user = users.find(
    (item) => item.id === 'u1' && item.role === 'volunteer'
  )

  if (!user) throw new Error('Для тестовой истории нужен волонтёр u1')

  const day = 86_400_000
  const today = new Date()
  today.setUTCHours(5, 0, 0, 0) // 10:00 в Екатеринбурге

  return templates.map((template, index) => {
    const status = outcomes[index % outcomes.length]
    const start = today.getTime() - (index + 1) * 3 * day
    const cutoff = start - day
    const id = `history-${template.id}`
    const confirmed = status === 'confirmed' ? 1 : 0

    const event: EventDetails = {
      ...template,
      id,
      status: status === 'event_cancelled' ? 'cancelled' : 'completed',
      startsAt: new Date(start).toISOString(),
      endsAt: new Date(start + 3 * 3_600_000).toISOString(),
      registrationEndsAt: new Date(cutoff).toISOString(),
      cancelReason:
        status === 'event_cancelled' ? 'Небезопасная погода' : undefined,
      registeredCount: confirmed,
      confirmedCount: confirmed,
      pendingCount: 0,
    }

    const application: Application = {
      id: `seed-${id}-${user.id}`,
      eventId: id,
      volunteer: { id: user.id, name: user.name, contact: user.login },
      status,
      createdAt: new Date(start - 4 * day).toISOString(),
      updatedAt: new Date(
        status === 'expired' ? cutoff : start - 2 * day
      ).toISOString(),
    }

    return { event, application }
  })
}
