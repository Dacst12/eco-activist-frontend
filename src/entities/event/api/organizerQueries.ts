'use client'

import { useQuery } from '@tanstack/react-query'
import { organizerEventsApi } from './organizer'

export const organizerEventQueryKey = (id: string) =>
  ['organizer-events', id] as const

export function useOrganizerEvent(id: string) {
  return useQuery({
    queryKey: organizerEventQueryKey(id),
    queryFn: () => organizerEventsApi.get(id),
  })
}
