'use client'

import { useRouter } from 'next/navigation'
import type { DictionaryItem } from '@/entities/dictionary'
import { organizerEventRoutes } from '@/shared/config/routes'
import { toEventInput } from '../lib/form'
import type { EventFormOutput } from '../model/eventSchema'
import { useCreateEvent } from '../model/useSaveEvent'
import { DraftActions } from './DraftActions'
import { EventForm } from './EventForm'

type NewEventFormProps = {
  types: DictionaryItem[]
  districts: DictionaryItem[]
  className?: string
}

export function NewEventForm({
  types,
  districts,
  className,
}: NewEventFormProps) {
  const router = useRouter()
  const createEvent = useCreateEvent()

  const handleSubmit = async (
    values: EventFormOutput,
    intent: string | undefined
  ) => {
    const event = await createEvent.mutateAsync(toEventInput(values))
    router.replace(
      intent === 'preview'
        ? organizerEventRoutes.preview(event.id)
        : organizerEventRoutes.edit(event.id)
    )
  }

  return (
    <EventForm
      types={types}
      districts={districts}
      onSubmit={handleSubmit}
      className={className}
    >
      {({ isSubmitting }) => <DraftActions isSubmitting={isSubmitting} />}
    </EventForm>
  )
}
