'use client'

import type { Route } from 'next'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { DictionaryItem } from '@/entities/dictionary'
import { useOrganizerEvent } from '@/entities/event'
import { getErrorMessage, isNotFound } from '@/shared/api'
import { organizerEventRoutes, routes } from '@/shared/config/routes'
import { toEventFormValues, toEventInput } from '../lib/form'
import type { EventFormOutput } from '../model/eventSchema'
import { useUpdateEvent } from '../model/useSaveEvent'
import { DraftActions } from './DraftActions'
import { EventForm } from './EventForm'
import { EventMessage } from './EventMessage'
import { PublishedActions } from './PublishedActions'
import Link from 'next/link'
import { buttonClass } from '@/shared/ui'

type EditEventFormProps = {
  id: string
  types: DictionaryItem[]
  districts: DictionaryItem[]
}

const toMyEvents = {
  href: routes.organizerEvents,
  label: 'К моим мероприятиям',
}

export function EditEventForm({ id, types, districts }: EditEventFormProps) {
  const router = useRouter()
  const { data: event, isPending, error } = useOrganizerEvent(id)
  const updateEvent = useUpdateEvent(id)
  const [saved, setSaved] = useState(false)
  const [openedAt] = useState(Date.now)

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

  const publicLink = {
    href: `/events/${id}` as Route,
    label: 'Открыть страницу мероприятия',
  }

  if (event.status === 'cancelled' || event.status === 'completed') {
    return (
      <EventMessage
        title={
          event.status === 'cancelled'
            ? 'Мероприятие отменено'
            : 'Мероприятие завершено'
        }
        text="Изменить его уже нельзя."
        link={publicLink}
      />
    )
  }

  const isDraft = event.status === 'draft'

  if (!isDraft && Date.parse(event.startsAt) <= openedAt) {
    return (
      <EventMessage
        title="Мероприятие уже началось"
        text="Изменить его после начала нельзя."
        link={publicLink}
      />
    )
  }

  const handleSubmit = async (
    values: EventFormOutput,
    intent: string | undefined
  ) => {
    setSaved(false)
    await updateEvent.mutateAsync(toEventInput(values))
    if (intent === 'preview') router.push(organizerEventRoutes.preview(id))
    else setSaved(true)
  }

  const capacityHint =
    event.registeredCount > 0
      ? `Занято мест: ${event.registeredCount} (подтверждено: ${event.confirmedCount}, на рассмотрении: ${event.pendingCount})`
      : undefined

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-title font-semibold">
            Редактирование мероприятия
          </h1>
          <p className="text-muted mt-2">
            {event.title} ·{' '}
            {isDraft ? 'черновик, ещё не виден волонтёрам' : 'опубликовано'}
          </p>
        </div>

        {!isDraft && (
          <Link href={publicLink.href} className={buttonClass('secondary')}>
            Страница мероприятия
          </Link>
        )}
      </div>

      <EventForm
        types={types}
        districts={districts}
        storageKey={`event-form:${id}`}
        defaultValues={toEventFormValues(event)}
        occupied={event.registeredCount}
        capacityHint={capacityHint}
        onSubmit={handleSubmit}
        className="mt-6"
      >
        {({ isSubmitting }) =>
          isDraft ? (
            <>
              <DraftActions isSubmitting={isSubmitting} />
              {saved && <p className="text-success-text">Черновик сохранён</p>}
            </>
          ) : (
            <PublishedActions
              eventId={id}
              isSubmitting={isSubmitting}
              saved={saved}
            />
          )
        }
      </EventForm>
    </>
  )
}
