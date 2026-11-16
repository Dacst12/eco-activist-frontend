import { Route } from 'next'

export const routes = {
  catalog: '/',
  login: '/login',
  register: '/register',
  privacy: '/privacy' as Route,
  knowledge: '/knowledge' as Route,
  myEvents: '/account/events' as Route,
  myImpact: '/account/points' as Route,
  organizerEvents: '/organizer/events' as Route,
} satisfies Record<string, Route>
