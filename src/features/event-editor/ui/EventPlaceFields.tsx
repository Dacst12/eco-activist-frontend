'use client'

import { useFormContext } from 'react-hook-form'
import type { DictionaryItem } from '@/entities/dictionary'
import { TextareaField, TextField } from '@/shared/ui'
import type { EventFormOutput, EventFormValues } from '../model/eventSchema'
import { LocationField } from './LocationField'

export function EventPlaceFields({
  districts,
}: {
  districts: DictionaryItem[]
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext<EventFormValues, unknown, EventFormOutput>()

  return (
    <section className="bg-surface rounded-card flex flex-col gap-4 p-6">
      <LocationField districts={districts} />

      <TextField
        label="Точка сбора"
        placeholder="У главного входа"
        hint="Необязательно. Если место большое, подскажите, где встречаемся"
        error={errors.meetingPoint?.message}
        {...register('meetingPoint')}
      />

      <TextareaField
        label="Условия участия *"
        placeholder="Что взять с собой и что выдадим на месте"
        error={errors.conditions?.message}
        {...register('conditions')}
      />

      <TextField
        label="Лимит участников *"
        inputMode="numeric"
        placeholder="30"
        error={errors.capacity?.message}
        {...register('capacity')}
      />
    </section>
  )
}
