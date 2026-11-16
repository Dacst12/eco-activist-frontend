'use client'

import { Controller, useFormContext } from 'react-hook-form'
import {
  DateTimeField,
  SelectField,
  TextareaField,
  TextField,
} from '@/shared/ui'
import type { EventFormOutput, EventFormValues } from '../model/eventSchema'

type EventMainFieldsProps = {
  types: { id: string; name: string }[]
}

export function EventMainFields({ types }: EventMainFieldsProps) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<EventFormValues, unknown, EventFormOutput>()

  return (
    <section className="bg-surface rounded-card flex flex-col gap-4 p-6">
      <TextField
        label="Название *"
        placeholder="Уборка в парке"
        error={errors.title?.message}
        {...register('title')}
      />

      <SelectField
        label="Категория *"
        placeholder="Выберите категорию"
        error={errors.typeId?.message}
        {...register('typeId')}
      >
        {types.map((type) => (
          <option key={type.id} value={type.id}>
            {type.name}
          </option>
        ))}
      </SelectField>

      <TextareaField
        label="Описание *"
        placeholder="Что будем делать"
        error={errors.description?.message}
        {...register('description')}
      />

      <Controller
        control={control}
        name="startsAt"
        render={({ field, fieldState }) => (
          <DateTimeField
            label="Начало *"
            error={fieldState.error?.message}
            {...field}
          />
        )}
      />

      <Controller
        control={control}
        name="endsAt"
        render={({ field, fieldState }) => (
          <DateTimeField
            label="Окончание *"
            error={fieldState.error?.message}
            {...field}
          />
        )}
      />

      <Controller
        control={control}
        name="registrationEndsAt"
        render={({ field, fieldState }) => (
          <DateTimeField
            label="Запись до"
            hint="Необязательно. Если не указать, запись закроется за 24 часа до начала"
            error={fieldState.error?.message}
            {...field}
          />
        )}
      />
    </section>
  )
}
