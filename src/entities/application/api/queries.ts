'use client'

import { queryOptions, useQuery } from '@tanstack/react-query'
import { applicationsApi } from './applications'

export const applicationQueryOptions = (eventId: string, userId: string) =>
  queryOptions({
    queryKey: ['event-application', eventId, userId] as const,
    queryFn: () => applicationsApi.mine(eventId),
    retry: false,
    staleTime: 0,
  })

export function useApplication(eventId: string, userId: string) {
  return useQuery({
    ...applicationQueryOptions(eventId, userId),
    refetchOnWindowFocus: true,
  })
}
