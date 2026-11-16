import type { EventDetails, EventInput } from '@/entities/event'
import { fromCityDateTime, toCityDateTime } from '@/shared/lib/date'
import type { EventFormOutput, EventFormValues } from '../model/eventSchema'

export const emptyEventForm: EventFormValues = {
  title: '',
  typeId: '',
  description: '',
  startsAt: '',
  endsAt: '',
  registrationEndsAt: '',
  address: '',
  location: null,
  districtId: '',
  meetingPoint: '',
  conditions: '',
  capacity: '',
}

export const eventFormFields = Object.keys(
  emptyEventForm
) as (keyof EventFormValues)[]

export const toEventFormValues = (event: EventDetails): EventFormValues => ({
  title: event.title,
  typeId: event.type.id,
  description: event.description,
  startsAt: toCityDateTime(event.startsAt),
  endsAt: toCityDateTime(event.endsAt),
  registrationEndsAt: toCityDateTime(event.registrationEndsAt),
  address: event.address,
  location: event.location,
  districtId: event.district.id,
  meetingPoint: event.meetingPoint ?? '',
  conditions: event.conditions,
  capacity: String(event.capacity),
})

export const toEventInput = (values: EventFormOutput): EventInput => ({
  title: values.title,
  typeId: values.typeId,
  description: values.description,
  startsAt: fromCityDateTime(values.startsAt),
  endsAt: fromCityDateTime(values.endsAt),
  registrationEndsAt: values.registrationEndsAt
    ? fromCityDateTime(values.registrationEndsAt)
    : undefined,
  address: values.address,
  location: values.location,
  districtId: values.districtId,
  meetingPoint: values.meetingPoint || undefined,
  conditions: values.conditions,
  capacity: Number(values.capacity),
})
