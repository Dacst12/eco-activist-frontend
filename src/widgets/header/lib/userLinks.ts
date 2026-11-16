import type { User } from '@/entities/user'
import { routes } from '@/shared/config/routes'
import type { UserLink } from '../model/types'

export function getUserLinks(user: User): UserLink[] {
  switch (user.role) {
    case 'volunteer':
      return [{ href: routes.myEvents, label: 'Мои мероприятия' }]
    case 'organizer':
      return user.organizerStatus === 'approved'
        ? [
            { href: routes.organizerEvents, label: 'Кабинет организатора' },
            { href: routes.newEvent, label: 'Создать мероприятие' },
          ]
        : [{ href: routes.organizerPending, label: 'Статус заявки' }]
    case 'admin':
      return []
  }
}
