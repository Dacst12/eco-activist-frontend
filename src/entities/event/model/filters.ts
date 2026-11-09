import { z } from 'zod'

const optionalId = z.string().min(1).max(64).optional().catch(undefined)
const optionalDate = z.iso.date().optional().catch(undefined)

export const eventFiltersSchema = z.object({
  type: optionalId,
  district: optionalId,
  from: optionalDate,
  to: optionalDate,
})

export type EventFilters = z.infer<typeof eventFiltersSchema>
