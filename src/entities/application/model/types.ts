export const applicationStatuses = [
  'pending',
  'confirmed',
  'rejected',
  'removed',
  'cancelled',
  'expired',
  'event_cancelled',
] as const

export type ApplicationStatus = (typeof applicationStatuses)[number]

export type Application = {
  id: string
  eventId: string
  volunteer: {
    id: string
    name: string
    contact: string
  }
  status: ApplicationStatus
  attendedAt?: string
  createdAt: string
  updatedAt: string
}

export type ApplicationListParams = {
  status?: ApplicationStatus
  page?: number
  pageSize?: number
}

export type ApplicationList = {
  items: Application[]
  total: number
  page: number
  pageSize: number

  statusCounts: Record<ApplicationStatus, number>

  seats: {
    capacity: number
    confirmed: number
    pending: number
    free: number
  }

  registrationEndsAt: string
}
