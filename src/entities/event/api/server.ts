import 'server-only'
import { serverApi, ServerApiError } from '@/shared/api/server'
import { toQueryString } from '@/shared/lib/url'
import type { EventFilters } from '../model/filters'
import type { EventDetails, EventSummary } from '../model/types'

export const getEvents = (filters: EventFilters = {}) => {
  const query = toQueryString(filters)
  return serverApi<EventSummary[]>(`/events${query ? `?${query}` : ''}`, {
    revalidate: 30,
  })
}

export const getEvent = async (id: string) => {
  try {
    return await serverApi<EventDetails>(`/events/${id}`, { revalidate: 30 })
  } catch (error) {
    if (error instanceof ServerApiError && error.status === 404) return null
    throw error
  }
}
