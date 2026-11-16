'use client'

import { buttonClass } from '@/shared/ui'
import { toEventInput } from '../lib/form'
import type { EventFormOutput } from '../model/eventSchema'
import { EventForm } from './EventForm'

type NewEventFormProps = {
  types: { id: string; name: string }[]
  className?: string
}

export function NewEventForm({ types, className }: NewEventFormProps) {
  const handleSubmit = (
    values: EventFormOutput,
    intent: string | undefined
  ) => {
    console.log(intent, toEventInput(values))
  }

  return (
    <EventForm types={types} onSubmit={handleSubmit} className={className}>
      <button
        type="submit"
        name="intent"
        value="draft"
        className={buttonClass('secondary')}
      >
        Сохранить черновик
      </button>
      <button
        type="submit"
        name="intent"
        value="preview"
        className={buttonClass('primary')}
      >
        Предпросмотр
      </button>
    </EventForm>
  )
}
