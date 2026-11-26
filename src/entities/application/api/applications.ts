import { api } from '@/shared/api'
import type {
  Application,
  ApplicationList,
  ApplicationListParams,
} from '../model/types'
import { MyEventsPage, MyEventsParams } from '../model/myEvents'
import { AttendanceResult } from '../model/attendance'

const eventPath = (eventId: string) => `/events/${encodeURIComponent(eventId)}`

const organizerPath = (eventId: string) =>
  `/organizer/events/${encodeURIComponent(eventId)}/applications`

export const applicationsApi = {
  myEvents: (params: MyEventsParams) =>
    api.get<MyEventsPage>('/account/events', { params }).then((r) => r.data),

  mine: (eventId: string) =>
    api
      .get<Application | null>(`${eventPath(eventId)}/application`)
      .then((r) => r.data),

  create: (eventId: string) =>
    api
      .post<Application>(`${eventPath(eventId)}/applications`)
      .then((r) => r.data),

  cancel: (eventId: string) =>
    api
      .post<Application>(`${eventPath(eventId)}/application/cancel`)
      .then((r) => r.data),
}

export const organizerApplicationsApi = {
  list: (eventId: string, params: ApplicationListParams = {}) =>
    api
      .get<ApplicationList>(organizerPath(eventId), { params })
      .then((r) => r.data),

  confirm: (eventId: string, id: string) =>
    api
      .post<Application>(
        `${organizerPath(eventId)}/${encodeURIComponent(id)}/confirm`
      )
      .then((r) => r.data),

  reject: (eventId: string, id: string) =>
    api
      .post<Application>(
        `${organizerPath(eventId)}/${encodeURIComponent(id)}/reject`
      )
      .then((r) => r.data),

  remove: (eventId: string, id: string) =>
    api
      .post<Application>(
        `${organizerPath(eventId)}/${encodeURIComponent(id)}/remove`
      )
      .then((r) => r.data),

  markPresent: (eventId: string, id: string) =>
    api
      .put<AttendanceResult>(
        `${organizerPath(eventId)}/${encodeURIComponent(id)}/attendance`
      )
      .then((r) => r.data),
}
