'use client'

import type { Route } from 'next'
import Link from 'next/link'
import { useSession } from '@/entities/user'
import { cn } from '@/shared/lib/cn'
import { loginHref } from '@/shared/lib/url'
import { Button, buttonClass } from '@/shared/ui'
import {
  VolunteerRegistration,
  type VolunteerRegistrationProps,
} from './VolunteerRegistration'

type JoinEventButtonProps = Omit<VolunteerRegistrationProps, 'userId'>

export function JoinEventButton(props: JoinEventButtonProps) {
  const { eventId, label, open, className } = props
  const session = useSession()

  if (session.isPending) {
    return (
      <div
        aria-hidden
        className={cn('bg-page rounded-control h-12 animate-pulse', className)}
      />
    )
  }

  if (session.isError) {
    return (
      <div className={cn('space-y-2', className)}>
        <p role="alert" className="text-danger-text text-sm">
          Не удалось проверить вход.
        </p>
        <Button variant="secondary" onClick={() => void session.refetch()}>
          Проверить вход
        </Button>
      </div>
    )
  }

  const user = session.data
  if (user?.role === 'volunteer') {
    return (
      <VolunteerRegistration
        key={`${user.id}:${eventId}`}
        userId={user.id}
        {...props}
      />
    )
  }

  if (!open)
    return (
      <Button disabled className={className}>
        {label}
      </Button>
    )

  if (user) {
    return (
      <p className={cn('text-muted text-sm', className)}>
        Записаться на мероприятие могут только волонтёры.
      </p>
    )
  }

  return (
    <div className={className}>
      <Link
        href={loginHref(`/events/${eventId}` as Route)}
        className={cn(buttonClass('primary'), 'w-full')}
      >
        {label}
      </Link>
      <p className="text-muted mt-2 text-sm">
        Чтобы записаться, войдите в аккаунт
      </p>
    </div>
  )
}
