import type { BadgeTone } from '@/shared/ui'

// Можно ли записаться на мероприятие — без учёта текущего пользователя
export type EventAvailability =
  'open' | 'full' | 'closed' | 'completed' | 'cancelled'

export const availabilityConfig: Record<
  EventAvailability,
  { action: string; badge: string; tone: BadgeTone }
> = {
  open: {
    action: 'Записаться',
    badge: 'Опубликовано · запись открыта',
    tone: 'success',
  },
  full: {
    action: 'Мест нет',
    badge: 'Опубликовано · мест нет',
    tone: 'warning',
  },
  closed: {
    action: 'Запись закрыта',
    badge: 'Опубликовано · запись закрыта',
    tone: 'neutral',
  },
  completed: {
    action: 'Завершено',
    badge: 'Мероприятие завершено',
    tone: 'neutral',
  },
  cancelled: {
    action: 'Отменено',
    badge: 'Мероприятие отменено',
    tone: 'danger',
  },
}
