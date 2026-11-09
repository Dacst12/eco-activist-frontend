import type { Route } from 'next'
import type { RegisterRequest } from '@/entities/user'
import { routes } from '@/shared/config/routes'
import { toQueryString } from '@/shared/lib/url'

export type RegisterRole = RegisterRequest['role']

export const parseRegisterRole = (value: unknown): RegisterRole =>
  value === 'organizer' ? 'organizer' : 'volunteer'

export const registerHref = (role: RegisterRole, next: Route): Route => {
  const query = toQueryString({
    role: role === 'organizer' ? 'organizer' : undefined,
    next: next === '/' ? undefined : next,
  })
  return (query ? `${routes.register}?${query}` : routes.register) as Route
}

export const organizerPendingHref = (next: Route): Route =>
  (next === '/'
    ? '/register/pending'
    : `/register/pending?next=${encodeURIComponent(next)}`) as Route
