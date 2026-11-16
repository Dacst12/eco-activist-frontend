'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { DictionaryItem } from '@/entities/dictionary'
import { useOrganizerEvent } from '@/entities/event'
import { getErrorMessage, isNotFound } from '@/shared/api'
import { organizerEventRoutes, routes } from '@/shared/config/routes'
import { buttonClass } from '@/shared/ui'
import { toEventFormValues, toEventInput } from '../lib/form'
import type { EventFormOutput } from '../model/eventSchema'
import { useUpdateEvent } from '../model/useSaveEvent'
import { DraftActions } from './DraftActions'
import { EventForm } from './EventForm'

type EditEventFormProps = {
  id: string
  types: DictionaryItem[]
  districts: DictionaryItem[]
}

export function EditEventForm({ id, types, districts }: EditEventFormProps) {
  const router = useRouter()
  const { data: event, isPending, error } = useOrganizerEvent(id)
  const updateEvent = useUpdateEvent(id)
  const [saved, setSaved] = useState(false)

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
          {isNotFound(error)
            ? 'Возможно, его удалили или оно принадлежит другому организатору.'
            : getErrorMessage(error)}
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

  if (event.status !== 'draft') {
    return <p></p>
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

  return (
    <>
      <h1 className="text-title font-semibold">Редактирование мероприятия</h1>
      <p className="text-muted mt-2">
        {event.title} · черновик, ещё не виден волонтёрам
      </p>

      <EventForm
        types={types}
        districts={districts}
        defaultValues={toEventFormValues(event)}
        occupied={event.registeredCount}
        onSubmit={handleSubmit}
        className="mt-6"
      >
        {({ isSubmitting }) => (
          <>
            <DraftActions isSubmitting={isSubmitting} />
            {saved && <p className="text-success-text">Черновик сохранён</p>}
          </>
        )}
      </EventForm>
    </>
  )
}
