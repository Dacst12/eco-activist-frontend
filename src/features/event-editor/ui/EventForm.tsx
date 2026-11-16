'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState, type ReactNode } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import type { DictionaryItem } from '@/entities/dictionary'
import { applyServerErrors } from '@/shared/lib/form'
import { FormError } from '@/shared/ui'
import { emptyEventForm, eventFormFields } from '../lib/form'
import {
  createEventSchema,
  type EventFormOutput,
  type EventFormValues,
} from '../model/eventSchema'
import { EventMainFields } from './EventMainFields'
import { EventPlaceFields } from './EventPlaceFields'

type EventFormProps = {
  types: DictionaryItem[]
  districts: DictionaryItem[]
  defaultValues?: EventFormValues
  occupied?: number
  capacityHint?: string
  onSubmit: (
    values: EventFormOutput,
    intent: string | undefined
  ) => Promise<void>
  children: (state: { isSubmitting: boolean }) => ReactNode
  className?: string
}

export function EventForm({
  types,
  districts,
  defaultValues = emptyEventForm,
  occupied = 0,
  capacityHint,
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

  const submit = form.handleSubmit(async (values, event) => {
    const submitter = (event?.nativeEvent as SubmitEvent | undefined)?.submitter
    const intent =
      submitter instanceof HTMLButtonElement ? submitter.value : undefined
    try {
      await onSubmit(values, intent)
      form.reset(values)
    } catch (error) {
      applyServerErrors(error, form.setError, eventFormFields)
    }
  })

  return (
    <FormProvider {...form}>
      <form noValidate onSubmit={submit} className={className}>
        <div className="grid items-start gap-6 lg:grid-cols-2">
          <EventMainFields types={types} />
          <EventPlaceFields districts={districts} capacityHint={capacityHint} />
        </div>

        <FormError
          message={form.formState.errors.root?.server?.message}
          className="mt-6"
        />

        <div className="mt-6 flex flex-wrap items-center gap-4">
          {children({ isSubmitting: form.formState.isSubmitting })}
        </div>
      </form>
    </FormProvider>
  )
}
