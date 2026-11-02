import type { SearchParams } from '@/shared/lib/url'
import { eventFiltersSchema, type EventFilters } from '../model/filters'

export const parseEventFilters = (params: SearchParams): EventFilters =>
  eventFiltersSchema.parse(params)
