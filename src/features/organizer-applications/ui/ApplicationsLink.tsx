'use client'

import Link from 'next/link'
import { useSession } from '@/entities/user'
import { organizerEventRoutes } from '@/shared/config/routes'
import { buttonClass } from '@/shared/ui'

export function ApplicationsLink({
  eventId,
  organizerId,
}: {
  eventId: string
  organizerId: string
}) {
  const { data: user } = useSession()

  if (
    user?.role !== 'organizer' ||
    user.organizerStatus !== 'approved' ||
    user.id !== organizerId
  ) {
    return null
  }

  return (
    <Link
      className={buttonClass(
        'secondary',
        'border-success-soft w-full border-2'
      )}
      href={organizerEventRoutes.applications(eventId)}
    >
      Заявки на мероприятие
    </Link>
  )
}
