import type { BadgeTone } from '@/shared/ui'
import type { EventStatus } from './types'

export const eventStatusConfig: Record<
  EventStatus,
  { label: string; tone: BadgeTone }
> = {
  draft: { label: 'Черновик', tone: 'neutral' },
  published: { label: 'Опубликовано', tone: 'success' },
  cancelled: { label: 'Отменено', tone: 'danger' },
  completed: { label: 'Завершено', tone: 'neutral' },
}
