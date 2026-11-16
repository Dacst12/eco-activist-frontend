'use client'

import type { Route } from 'next'
import Link from 'next/link'
import { useSession } from '@/entities/user'
import { cn } from '@/shared/lib/cn'
import { loginHref } from '@/shared/lib/url'
import { Button, buttonClass } from '@/shared/ui'

type JoinEventButtonProps = {
  eventId: string
  label: string
  open: boolean
  className?: string
}

export function JoinEventButton({
  eventId,
  label,
  open,
  className,
}: JoinEventButtonProps) {
  const { data: user, isPending } = useSession()

  if (!open) {
    return (
      <Button disabled className={className}>
        {label}
      </Button>
    )
  }

  if (isPending) {
    return (
      <div
        aria-hidden
        className={cn('bg-page rounded-control h-11 animate-pulse', className)}
      />
    )
  }

  if (!user) {
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

  if (user.role !== 'volunteer') {
    return (
      <p className={cn('text-muted text-sm', className)}>
        Записаться на мероприятие могут только волонтёры.
      </p>
    )
  }

  return (
    <Button disabled className={className}>
      {label}
    </Button>
  )
}
