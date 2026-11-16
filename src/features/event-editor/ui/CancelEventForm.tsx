'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import type { Route } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useOrganizerEvent } from '@/entities/event'
import { getErrorMessage, isNotFound } from '@/shared/api'
import { organizerEventRoutes, routes } from '@/shared/config/routes'
import { cn } from '@/shared/lib/cn'
import { applyServerErrors } from '@/shared/lib/form'
import { buttonClass, FormError, TextField } from '@/shared/ui'
import {
  cancelEventSchema,
  type CancelEventFormValues,
} from '../model/cancelSchema'
import { useCancelEvent } from '../model/useCancelEvent'
import { EventMessage } from './EventMessage'

const toMyEvents = {
  href: routes.organizerEvents,
  label: 'К моим мероприятиям',
}

export function CancelEventForm({ id }: { id: string }) {
  const router = useRouter()
  const { data: event, isPending, error } = useOrganizerEvent(id)
  const cancelEvent = useCancelEvent(id)
  const [openedAt] = useState(Date.now)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CancelEventFormValues>({
    resolver: zodResolver(cancelEventSchema),
    defaultValues: { reason: '' },
    mode: 'onTouched',
  })

  if (isPending)
    return <p className="text-muted py-16 text-center">Загрузка…</p>

  if (error) {
    return isNotFound(error) ? (
      <EventMessage
        title="Мероприятие не найдено"
        text="Возможно, его удалили или оно принадлежит другому организатору."
        link={toMyEvents}
      />
    ) : (
      <EventMessage
        title="Не удалось загрузить"
        text={getErrorMessage(error)}
        link={toMyEvents}
      />
    )
  }

  const publicHref = `/events/${id}` as Route

  if (event.status === 'draft') {
    return (
      <EventMessage
        title="Это черновик"
        text="Волонтёры его не видят, отменять нечего."
        link={{ href: organizerEventRoutes.edit(id), label: 'К черновику' }}
      />
    )
  }

  if (event.status !== 'published' || Date.parse(event.startsAt) <= openedAt) {
    return (
      <EventMessage
        title={
          event.status === 'cancelled'
            ? 'Мероприятие уже отменено'
            : 'Мероприятие уже началось'
        }
        text={
          event.status === 'cancelled'
            ? undefined
            : 'Отменить его после начала нельзя.'
        }
        link={{ href: publicHref, label: 'Открыть страницу мероприятия' }}
      />
    )
  }

  const onSubmit = handleSubmit(async ({ reason }) => {
    try {
      await cancelEvent.mutateAsync({ reason })
      router.replace(publicHref)
    } catch (submitError) {
      applyServerErrors(submitError, setError, ['reason'])
    }
  })

  return (
    <>
      <h1 className="text-title font-semibold">Отменить мероприятие?</h1>
      <p className="text-muted mt-2">{event.title}</p>

      <form
        noValidate
        onSubmit={onSubmit}
        className="mt-6 flex max-w-2xl flex-col gap-6"
      >
        <TextField
          label="Причина отмены *"
          placeholder="Плохая погода"
          hint="Участники увидят её в уведомлении и на странице мероприятия"
          error={errors.reason?.message}
          {...register('reason')}
        />

        <section className="bg-surface rounded-card p-6">
          <h2 className="text-subtitle font-semibold">Что произойдёт</h2>
          <p className="text-muted mt-2">
            Все активные заявки и подтверждённые записи получат статус
            «Мероприятие отменено». Участники получат уведомление с причиной.
            Мероприятие исчезнет из каталога и с карты. Вернуть его нельзя.
          </p>
        </section>

        <FormError message={errors.root?.server?.message} />

        <div className="flex flex-wrap gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              buttonClass('primary'),
              'bg-danger hover:bg-danger/90'
            )}
          >
            {isSubmitting ? 'Отменяем…' : 'Отменить мероприятие'}
          </button>
          <Link
            href={organizerEventRoutes.edit(id)}
            className={buttonClass('secondary')}
          >
            Вернуться
          </Link>
        </div>
      </form>
    </>
  )
}
