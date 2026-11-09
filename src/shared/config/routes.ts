import { Route } from 'next'

export const routes = {
  catalog: '/',
  login: '/login',
  register: '/register' as Route,
  knowledge: '/knowledge' as Route,
  myEvents: '/me' as Route,
  myImpact: '/me/points' as Route,
} satisfies Record<string, Route>
