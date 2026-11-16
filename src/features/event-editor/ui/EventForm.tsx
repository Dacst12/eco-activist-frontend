'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState, type ReactNode } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { cn } from '@/shared/lib/cn'
import { emptyEventForm } from '../lib/form'
import {
  createEventSchema,
  type EventFormOutput,
  type EventFormValues,
} from '../model/eventSchema'
import { EventMainFields } from './EventMainFields'
import { EventPlaceFields } from './EventPlaceFields'
import { DictionaryItem } from '@/entities/dictionary'

type EventFormProps = {
  types: DictionaryItem[]
  districts: DictionaryItem[]
  defaultValues?: EventFormValues
  occupied?: number
  onSubmit: (
    values: EventFormOutput,
    intent: string | undefined
  ) => void | Promise<void>
  children: ReactNode
  className?: string
}

export function EventForm({
  types,
  districts,
  defaultValues = emptyEventForm,
  occupied = 0,
  onSubmit,
  children,
  className,
}: EventFormProps) {
  const [schema] = useState(() => createEventSchema(occupied))

  const form = useForm<EventFormValues, unknown, EventFormOutput>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onTouched',
  })

  const submit = form.handleSubmit((values, event) => {
    const submitter = (event?.nativeEvent as SubmitEvent | undefined)?.submitter
    return onSubmit(
      values,
      submitter instanceof HTMLButtonElement ? submitter.value : undefined
    )
  })

  return (
    <FormProvider {...form}>
      <form noValidate onSubmit={submit} className={className}>
        <div className="grid items-start gap-6 lg:grid-cols-2">
          <EventMainFields types={types} />
          <EventPlaceFields districts={districts} />
        </div>

        <div className={cn('mt-6 flex flex-wrap gap-4')}>{children}</div>
      </form>
    </FormProvider>
  )
}
