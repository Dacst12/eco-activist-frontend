import type { EventAvailability } from '../model/availability'
import type { EventDetails } from '../model/types'
import { isFull } from './seats'

export const getEventAvailability = (
  event: EventDetails
): EventAvailability => {
  const now = new Date()

  if (event.status === 'cancelled') return 'cancelled'
  if (event.status === 'completed' || new Date(event.endsAt) < now)
    return 'completed'
  if (new Date(event.registrationEndsAt) < now) return 'closed'
  if (isFull(event)) return 'full'
  return 'open'
}
