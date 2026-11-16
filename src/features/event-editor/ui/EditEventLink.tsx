'use client'

import Link from 'next/link'
import { useSession } from '@/entities/user'
import { organizerEventRoutes } from '@/shared/config/routes'
import { cn } from '@/shared/lib/cn'
import { buttonClass } from '@/shared/ui'

type EditEventLinkProps = {
  eventId: string
  organizerId: string
  className?: string
}

export function EditEventLink({
  eventId,
  organizerId,
  className,
}: EditEventLinkProps) {
  const { data: user } = useSession()
  if (user?.id !== organizerId) return null

  return (
    <Link
      href={organizerEventRoutes.edit(eventId)}
      className={cn(buttonClass('secondary'), className)}
    >
      Редактировать
    </Link>
  )
}
