import { api } from '@/shared/api'
import type {
  CancelEventRequest,
  EventDetails,
  EventInput,
} from '../model/types'

export const organizerEventsApi = {
  get: (id: string) =>
    api.get<EventDetails>(`/organizer/events/${id}`).then((r) => r.data),

  create: (data: EventInput) =>
    api.post<EventDetails>('/organizer/events', data).then((r) => r.data),

  update: (id: string, data: EventInput) =>
    api.put<EventDetails>(`/organizer/events/${id}`, data).then((r) => r.data),

  publish: (id: string) =>
    api
      .post<EventDetails>(`/organizer/events/${id}/publish`)
      .then((r) => r.data),

  cancel: (id: string, data: CancelEventRequest) =>
    api
      .post<EventDetails>(`/organizer/events/${id}/cancel`, data)
      .then((r) => r.data),
}
