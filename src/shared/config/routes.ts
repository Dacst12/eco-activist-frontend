import type { Route } from 'next'

export const routes = {
  catalog: '/',
  knowledge: '/knowledge' as Route,
  login: '/login' as Route,
  myEvents: '/me' as Route,
  myImpact: '/me/points' as Route,
} satisfies Record<string, Route>
