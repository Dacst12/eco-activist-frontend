export type EventStatus = 'draft' | 'published' | 'cancelled' | 'completed'

export type GeoPoint = { lat: number; lng: number }

type NamedRef = { id: string; name: string }

export type EventSummary = {
  id: string
  title: string
  type: NamedRef
  district: NamedRef
  organizer: NamedRef
  startsAt: string
  endsAt: string
  address: string
  location: GeoPoint
  capacity: number
  registeredCount: number
  points: number
  status: EventStatus
}

export type EventDetails = EventSummary & {
  description: string
  conditions: string
  organizerContacts: string
  meetingPoint?: string
  confirmedCount: number
  pendingCount: number
  registrationEndsAt: string
  cancelReason?: string
}

export type EventInput = {
  title: string
  typeId: string
  description: string
  startsAt: string
  endsAt: string
  registrationEndsAt?: string
  address: string
  location: GeoPoint
  districtId: string
  meetingPoint?: string
  conditions: string
  capacity: number
}

export type CancelEventRequest = { reason: string }
