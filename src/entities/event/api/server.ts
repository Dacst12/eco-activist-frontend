import 'server-only'
import { serverApi } from '@/shared/api/server'
import type { EventDetails, EventSummary } from '../model/types'

export const getEvents = () =>
  serverApi<EventSummary[]>('/events', { revalidate: 30 })

export const getEvent = (id: string) =>
  serverApi<EventDetails>(`/events/${id}`, { revalidate: 30 })
