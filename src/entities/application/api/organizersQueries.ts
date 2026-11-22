'use client'

import { useQuery } from '@tanstack/react-query'
import { organizerApplicationsApi } from './applications'
import type { ApplicationListParams } from '../model/types'

export function useOrganizerApplications(
  eventId: string,
  params: ApplicationListParams
) {
  return useQuery({
    queryKey: ['organizer-applications', eventId, params],
    queryFn: () => organizerApplicationsApi.list(eventId, params),
    retry: false,
  })
}
