import { Route } from 'next'

export const routes = {
  catalog: '/',
  login: '/login',
  register: '/register',
  privacy: '/privacy' as Route,
  knowledge: '/knowledge' as Route,
  myEvents: '/account/events',
  myImpact: '/account/points' as Route,
  organizerPending: '/register/pending',
  organizerEvents: '/organizer/events',
  newEvent: '/organizer/events/new',
} satisfies Record<string, Route>
