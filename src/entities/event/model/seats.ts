import type { EventSummary } from './types'

export const getFreeSeats = (event: EventSummary) =>
  Math.max(event.capacity - event.registeredCount, 0)

export const isFull = (event: EventSummary) => getFreeSeats(event) === 0
