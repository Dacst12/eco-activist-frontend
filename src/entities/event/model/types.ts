export type EventStatus =
  'draft' | 'moderation' | 'published' | 'cancelled' | 'completed'

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
  inventory: string[]
  organizerContacts: string
}
