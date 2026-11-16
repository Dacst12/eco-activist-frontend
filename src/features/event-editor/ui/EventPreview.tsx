'use client'

import type { Route } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { EventDetailsView, useOrganizerEvent } from '@/entities/event'
import { getErrorMessage, isNotFound } from '@/shared/api'
import { CITY_TIMEZONE_LABEL } from '@/shared/config/locale'
import { organizerEventRoutes, routes } from '@/shared/config/routes'
import { cn } from '@/shared/lib/cn'
import { formatDateTime } from '@/shared/lib/date'
import { Badge, buttonClass, FormError } from '@/shared/ui'
import { usePublishEvent } from '../model/usePublishEvent'

export function EventPreview({ id }: { id: string }) {
  const router = useRouter()
  const { data: event, isPending, error } = useOrganizerEvent(id)
  const publish = usePublishEvent(id)

  if (isPending)
    return <p className="text-muted py-16 text-center">Загрузка…</p>

  if (error) {
    return (
      <section className="mx-auto max-w-md py-16 text-center">
        <h1 className="text-title font-semibold">
          {isNotFound(error)
            ? 'Мероприятие не найдено'
            : 'Не удалось загрузить'}
        </h1>
        <p className="text-muted mt-2">
          {!isNotFound(error) && getErrorMessage(error)}
        </p>
        <div className="mt-6">
          <Link
            href={routes.organizerEvents}
            className={buttonClass('primary')}
          >
            К моим мероприятиям
          </Link>
        </div>
      </section>
    )
  }

  const publicHref = `/events/${id}` as Route

  if (event.status !== 'draft') {
    return (
      <section className="mx-auto max-w-md py-16 text-center">
        <h1 className="text-title font-semibold">
          {event.status === 'cancelled'
            ? 'Мероприятие отменено'
            : 'Мероприятие уже опубликовано'}
        </h1>
        <div className="mt-6">
          <Link href={publicHref} className={buttonClass('primary')}>
            Открыть страницу мероприятия
          </Link>
        </div>
      </section>
    )
  }

  const handlePublish = async () => {
    await publish.mutateAsync()
    router.replace(publicHref)
  }

  return (
    <EventDetailsView
      event={event}
      badge={<Badge tone="warning">Черновик · ещё не виден волонтёрам</Badge>}
      aside={
        <>
          <p>
            Запись до {formatDateTime(event.registrationEndsAt)} (
            {CITY_TIMEZONE_LABEL}). Участие подтвердит организатор.
          </p>

          {publish.error && (
            <FormError message={getErrorMessage(publish.error)} />
          )}

          <button
            type="button"
            onClick={() => void handlePublish()}
            disabled={publish.isPending}
            className={cn(buttonClass('primary'), 'w-full')}
          >
            {publish.isPending ? 'Публикуем…' : 'Опубликовать'}
          </button>
          <Link
            href={organizerEventRoutes.edit(id)}
            className={cn(buttonClass('secondary'), 'w-full')}
          >
            Вернуться к форме
          </Link>
        </>
      }
    />
  )
}
