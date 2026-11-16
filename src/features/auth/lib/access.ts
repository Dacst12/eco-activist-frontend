import type { User, UserRole } from '@/entities/user'
import type { Access } from '../model/types'

export function getAccess(
  user: User | null,
  roles: readonly UserRole[]
): Access {
  if (!user) return 'login'
  if (!roles.includes(user.role)) return 'forbidden'

  if (user.role === 'organizer' && user.organizerStatus !== 'approved')
    return 'pending'

  return 'allow'
}
