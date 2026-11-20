import type { BadgeTone } from '@/shared/ui'
import { ApplicationStatus } from './types'

export const applicationStatusConfig: Record<
  ApplicationStatus,
  { label: string; tone: BadgeTone }
> = {
  pending: {
    label: 'Запись ожидает подтверждения',
    tone: 'warning',
  },
  confirmed: {
    label: 'Запись подтверждена',
    tone: 'success',
  },
  rejected: {
    label: 'Запись отклонена',
    tone: 'danger',
  },
  removed: {
    label: 'Запись отменена организатором',
    tone: 'danger',
  },
  cancelled: {
    label: 'Запись отменена волонтёром',
    tone: 'neutral',
  },
  expired: {
    label: 'Запись истекла',
    tone: 'warning',
  },
  event_cancelled: {
    label: 'Мероприятие отменено',
    tone: 'danger',
  },
}
