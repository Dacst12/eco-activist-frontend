'use client'

import { queryOptions, useQuery } from '@tanstack/react-query'
import type { MyEventsSection } from '../model/myEvents'
import { applicationsApi } from './applications'

const applicationQueryDefaults = {
  staleTime: 0,
  retry: false,
  refetchOnWindowFocus: true,
} as const

export const applicationQueryOptions = (eventId: string, userId: string) =>
  queryOptions({
    ...applicationQueryDefaults,
    queryKey: ['event-application', eventId, userId] as const,
    queryFn: () => applicationsApi.mine(eventId),
  })

export function useApplication(eventId: string, userId: string) {
  return useQuery(applicationQueryOptions(eventId, userId))
}

export function useMyEvents(
  userId: string | undefined,
  section: MyEventsSection,
  page: number
) {
  return useQuery({
    ...applicationQueryDefaults,
    queryKey: ['my-events', userId, section, page],
    queryFn: () => applicationsApi.myEvents({ section, page, pageSize: 10 }),
    enabled: Boolean(userId),
  })
}
