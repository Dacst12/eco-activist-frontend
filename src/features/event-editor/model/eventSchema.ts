import { z } from 'zod'
import { CITY_DATE_TIME, fromCityDateTime } from '@/shared/lib/date'
import { requiredString } from '@/shared/lib/validation'

const HOUR = 60 * 60 * 1000
export const MAX_CAPACITY = 1000

const toTime = (value: string) => Date.parse(fromCityDateTime(value))

export function createEventSchema(occupied = 0) {
  const minCapacity = Math.max(1, occupied)

  return z
    .object({
      title: requiredString('Укажите название').max(
        120,
        'Не длиннее 120 символов'
      ),
      typeId: requiredString('Выберите категорию'),
      description: requiredString('Опишите мероприятие').max(
        5000,
        'Не длиннее 5000 символов'
      ),
      startsAt: z.string().regex(CITY_DATE_TIME, 'Укажите дату и время начала'),
      endsAt: z
        .string()
        .regex(CITY_DATE_TIME, 'Укажите дату и время окончания'),
      registrationEndsAt: z
        .string()
        .refine(
          (value) => value === '' || CITY_DATE_TIME.test(value),
          'Введите дату и время полностью'
        ),
      address: requiredString('Укажите адрес').max(
        300,
        'Не длиннее 300 символов'
      ),
      location: z
        .object({ lat: z.number(), lng: z.number() })
        .nullable()
        .refine((value) => value !== null, 'Поставьте точку на карте'),
      districtId: z
        .string()
        .min(1, 'Не удалось определить район — передвиньте точку'),
      meetingPoint: z.string().trim().max(200, 'Не длиннее 200 символов'),
      conditions: requiredString('Опишите условия участия').max(
        2000,
        'Не длиннее 2000 символов'
      ),
      capacity: z
        .string()
        .trim()
        .regex(/^\d+$/, 'Укажите целое число')
        .refine(
          (value) => Number(value) >= minCapacity,
          occupied > 0
            ? `Лимит не меньше ${occupied} занятых мест`
            : 'Нужно хотя бы одно место'
        )
        .refine(
          (value) => Number(value) <= MAX_CAPACITY,
          `Не больше ${MAX_CAPACITY}`
        ),
    })
    .superRefine((values, ctx) => {
      if (!CITY_DATE_TIME.test(values.startsAt)) return
      const now = Date.now()
      const startsAt = toTime(values.startsAt)

      if (startsAt <= now) {
        ctx.addIssue({
          code: 'custom',
          path: ['startsAt'],
          message: 'Начало должно быть в будущем',
        })
      }

      if (
        CITY_DATE_TIME.test(values.endsAt) &&
        toTime(values.endsAt) <= startsAt
      ) {
        ctx.addIssue({
          code: 'custom',
          path: ['endsAt'],
          message: 'Окончание должно быть позже начала',
        })
      }

      if (values.registrationEndsAt) {
        const registrationEndsAt = toTime(values.registrationEndsAt)
        if (registrationEndsAt > startsAt) {
          ctx.addIssue({
            code: 'custom',
            path: ['registrationEndsAt'],
            message: 'Запись должна закрываться не позже начала',
          })
        } else if (registrationEndsAt <= now) {
          ctx.addIssue({
            code: 'custom',
            path: ['registrationEndsAt'],
            message: 'Это время уже прошло',
          })
        }
      } else if (startsAt > now && startsAt - 24 * HOUR <= now) {
        ctx.addIssue({
          code: 'custom',
          path: ['registrationEndsAt'],
          message:
            'До начала меньше суток — укажите, до какого времени идёт запись',
        })
      }
    })
}

export type EventFormValues = z.input<ReturnType<typeof createEventSchema>>
export type EventFormOutput = z.output<ReturnType<typeof createEventSchema>>
