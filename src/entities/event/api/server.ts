import 'server-only'
import { serverApi } from '@/shared/api/server'
import { toQueryString } from '@/shared/lib/url'
import type { EventFilters } from '../model/filters'
import type { EventDetails, EventSummary } from '../model/types'

export const getEvents = (filters: EventFilters = {}) => {
  const query = toQueryString(filters)
  return serverApi<EventSummary[]>(`/events${query ? `?${query}` : ''}`, {
    revalidate: 30,
  })
}

export const getEvent = (id: string) =>
  serverApi<EventDetails>(`/events/${id}`, { revalidate: 30 })
