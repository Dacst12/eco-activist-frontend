import { Route } from 'next'

export const routes = {
  catalog: '/',
  login: '/login',
  register: '/register',
  privacy: '/privacy' as Route,
  knowledge: '/knowledge' as Route,
  account: '/account',
  myEvents: '/account/events',
  myEventsHistory: '/account/events/history',
  myImpact: '/account/points' as Route,
  organizerPending: '/register/pending',
  organizerEvents: '/organizer/events',
  newEvent: '/organizer/events/new',
} satisfies Record<string, Route>

export const organizerEventRoutes = {
  applications: (id: string) => `/organizer/events/${id}/applications` as Route,
  edit: (id: string) => `/organizer/events/${id}/edit` as Route,
  preview: (id: string) => `/organizer/events/${id}/preview` as Route,
  cancel: (id: string) => `/organizer/events/${id}/cancel` as Route,
}

export const volunteerEventRoutes = {
  qr: (id: string) => `/account/events/${encodeURIComponent(id)}/qr` as const,
}
