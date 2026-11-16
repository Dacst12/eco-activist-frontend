'use client'

import Link from 'next/link'
import { useFormState } from 'react-hook-form'
import { organizerEventRoutes } from '@/shared/config/routes'
import { cn } from '@/shared/lib/cn'
import { buttonClass } from '@/shared/ui'
import type { EventFormValues } from '../model/eventSchema'

const NOTIFY_FIELDS = [
  'startsAt',
  'endsAt',
  'address',
  'location',
  'meetingPoint',
] as const

type PublishedActionsProps = {
  eventId: string
  isSubmitting: boolean
  saved: boolean
}

export function PublishedActions({
  eventId,
  isSubmitting,
  saved,
}: PublishedActionsProps) {
  const { isDirty, dirtyFields } = useFormState<EventFormValues>()
  const notify = NOTIFY_FIELDS.some((name) => Boolean(dirtyFields[name]))

  return (
    <>
      {notify && (
        <div className="bg-warning-soft rounded-card basis-full p-4">
          <p className="font-semibold">Участники будут уведомлены</p>
          <p className="text-warning-text mt-1 text-sm">
            Изменение времени и места отправит уведомление всем с активными
            заявками и подтверждёнными записями.
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={!isDirty || isSubmitting}
        className={buttonClass('primary')}
      >
        {isSubmitting ? 'Сохраняем…' : 'Сохранить изменения'}
      </button>

      <Link
        href={organizerEventRoutes.cancel(eventId)}
        className={cn(buttonClass('primary'), 'bg-danger hover:bg-danger/90')}
      >
        Отменить мероприятие
      </Link>

      {saved && !isDirty && (
        <p className="text-success-text">Изменения сохранены</p>
      )}
    </>
  )
}
