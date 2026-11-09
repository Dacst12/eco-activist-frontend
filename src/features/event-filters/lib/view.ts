import type { Route } from 'next'
import type { EventFilters } from '@/entities/event'
import { toQueryString } from '@/shared/lib/url'

export type CatalogView = 'list' | 'map'

export const parseCatalogView = (value: unknown): CatalogView =>
  value === 'map' ? 'map' : 'list'

export const parseSelectedEvent = (value: unknown) =>
  typeof value === 'string' && value.length > 0 ? value : undefined

export const catalogHref = (
  filters: EventFilters,
  view: CatalogView,
  selected?: string
): Route => {
  const query = toQueryString({
    ...filters,
    view: view === 'map' ? 'map' : undefined,
    selected,
  })
  return (query ? `/?${query}` : '/') as Route
}
