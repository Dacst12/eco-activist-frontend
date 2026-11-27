'use client'

import { queryOptions, useQuery } from '@tanstack/react-query'
import type { MyEventsSection } from '../model/myEvents'
import { applicationsApi } from './applications'
import { attendanceClosesAt } from '../model/attendance'

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
    refetchInterval: (query) => {
      const now = Date.now()

      const waitingForAttendance = query.state.data?.items.some(
        ({ application, event }) =>
          application.status === 'confirmed' &&
          !application.attendedAt &&
          Date.parse(event.startsAt) <= now &&
          now < attendanceClosesAt(event.endsAt)
      )

      return waitingForAttendance ? 30_000 : false
    },
  })
}

export function useVolunteerQr(eventId: string, userId?: string) {
  return useQuery({
    queryKey: ['volunteer-qr', userId, eventId],
    queryFn: () => applicationsApi.qr(eventId),
    enabled: Boolean(userId),
    retry: false,
    gcTime: 0,
    refetchOnWindowFocus: 'always',
    refetchInterval: (query) => {
      const qr = query.state.data
      if (!qr || query.state.status === 'error') return false

      const remaining = attendanceClosesAt(qr.event.endsAt) - Date.now()
      return Math.max(100, Math.min(30_000, remaining))
    },
  })
}
