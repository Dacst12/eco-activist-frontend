import { z } from 'zod'

const optionalId = z.string().min(1).max(64).optional().catch(undefined)
const optionalDate = z.iso.date().optional().catch(undefined)

export const eventFiltersSchema = z.object({
  type: optionalId,
  district: optionalId,
  organizer: optionalId,
  from: optionalDate,
  to: optionalDate,
  seats: z.literal('1').optional().catch(undefined),
})

export type EventFilters = z.infer<typeof eventFiltersSchema>
