import type { BadgeTone } from '@/shared/ui'
import type { OrganizerStatus, UserRole } from './types'

export const roleLabel: Record<UserRole, string> = {
  volunteer: 'Волонтёр',
  organizer: 'Организатор',
  admin: 'Администратор',
}

export const organizerStatusConfig: Record<
  OrganizerStatus,
  { label: string; tone: BadgeTone }
> = {
  pending: { label: 'На проверке', tone: 'warning' },
  approved: { label: 'Подтверждён', tone: 'success' },
  rejected: { label: 'Отклонён', tone: 'danger' },
}
