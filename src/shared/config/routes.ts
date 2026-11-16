import { Route } from 'next'

export const routes = {
  catalog: '/',
  login: '/login',
  register: '/register',
  privacy: '/privacy' as Route,
  knowledge: '/knowledge' as Route,
  myEvents: '/account/events',
  myImpact: '/account/points' as Route,
  organizerEvents: '/organizer/events',
  organizerPending: '/register/pending',
} satisfies Record<string, Route>
