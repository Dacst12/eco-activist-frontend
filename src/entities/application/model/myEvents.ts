import type { EventDetails } from '@/entities/event'
import type { Application } from './types'

export type MyEventsSection = 'active' | 'history'

export type MyEventsParams = {
  section: MyEventsSection
  page?: number
  pageSize?: number
}

export type MyEventItem = {
  application: Pick<Application, 'id' | 'status' | 'updatedAt' | 'attendedAt'>
  event: Pick<
    EventDetails,
    | 'id'
    | 'title'
    | 'status'
    | 'startsAt'
    | 'endsAt'
    | 'address'
    | 'meetingPoint'
    | 'registrationEndsAt'
  >
}

export type MyEventsPage = {
  items: MyEventItem[]
  total: number
  page: number
  pageSize: number
}
