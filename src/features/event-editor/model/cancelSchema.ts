import { z } from 'zod'
import { requiredString } from '@/shared/lib/validation'

export const cancelEventSchema = z.object({
  reason: requiredString('Укажите причину отмены').max(
    500,
    'Не длиннее 500 символов'
  ),
})

export type CancelEventFormValues = z.infer<typeof cancelEventSchema>
