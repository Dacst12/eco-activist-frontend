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
