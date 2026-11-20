import type { Application } from '@/entities/application'
import { events } from './events'
import { users } from './users'

const volunteers = users.filter((user) => user.role === 'volunteer')
const now = Date.now()
const MINUTE = 60_000

export const applications: Application[] = events.flatMap((event) => {
  const latestSubmission = Math.min(now, Date.parse(event.registrationEndsAt))

  return Array.from({ length: event.registeredCount }, (_, index) => {
    const user = event.id === '1' ? volunteers[index] : undefined
    const createdAt = new Date(
      latestSubmission - (event.registeredCount - index) * MINUTE
    ).toISOString()

    return {
      id: `seed-${event.id}-${index + 1}`,
      eventId: event.id,
      volunteer: user
        ? { id: user.id, name: user.name, contact: user.login }
        : {
            id: `seed-volunteer-${index + 1}`,
            name: `Волонтёр ${index + 1}`,
            contact: `volunteer-${index + 1}@example.test`,
          },
      status: index < event.confirmedCount ? 'confirmed' : 'pending',
      createdAt,
      updatedAt: createdAt,
    }
  })
})
