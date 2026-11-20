import type { BadgeTone } from '@/shared/ui'
import { ApplicationStatus } from './types'

export const applicationStatusConfig: Record<
  ApplicationStatus,
  { label: string; tone: BadgeTone }
> = {
  pending: {
    label: 'Ожидает подтверждения',
    tone: 'warning',
  },
  confirmed: {
    label: 'Подтверждена',
    tone: 'success',
  },
  rejected: {
    label: 'Отклонена',
    tone: 'danger',
  },
  removed: {
    label: 'Снят организатором',
    tone: 'danger',
  },
  cancelled: {
    label: 'Отменена волонтёром',
    tone: 'neutral',
  },
  expired: {
    label: 'Истекла',
    tone: 'warning',
  },
  event_cancelled: {
    label: 'Мероприятие отменено',
    tone: 'danger',
  },
}
