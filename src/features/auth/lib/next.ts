import { routes } from '@/shared/config/routes'
import type { Route } from 'next'

export const getSafeNext = (value: unknown): Route => {
  if (typeof value !== 'string') return '/'
  if (
    !value.startsWith('/') ||
    value.startsWith('//') ||
    value.startsWith('/\\')
  )
    return '/'
  return value as Route
}

export const loginHref = (next: Route): Route =>
  (next === '/'
    ? routes.login
    : `${routes.login}?next=${encodeURIComponent(next)}`) as Route
