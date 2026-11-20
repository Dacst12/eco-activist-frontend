import { http, HttpResponse } from 'msw'
import type {
  CancelEventRequest,
  EventDetails,
  EventInput,
} from '@/entities/event'
import { districts, eventTypes } from '../data/dictionaries'
import { events, pointsByType } from '../data/events'
import { users } from '../data/users'
import { readAccessToken } from '../lib/tokens'
import { syncApplications } from '../lib/applications'

const HOUR = 60 * 60 * 1000

let nextId = events.length + 1

const problem = (
  status: number,
  title: string,
  errors?: Record<string, string[]>
) => HttpResponse.json({ status, title, errors }, { status })

function getOrganizer(request: Request) {
  const userId = readAccessToken(request.headers.get('Authorization'))
  const user = users.find((u) => u.id === userId)
  if (!user) return problem(401, 'Требуется вход')
  if (user.role !== 'organizer' || user.organizerStatus !== 'approved')
    return problem(403, 'Нет доступа')
  return user
}

const findOwnEvent = (id: unknown, organizerId: string) =>
  events.find((e) => e.id === id && e.organizer.id === organizerId)

const hasStarted = (event: EventDetails) =>
  Date.parse(event.startsAt) <= Date.now()

function validate(input: EventInput, occupied: number) {
  const errors: Record<string, string[]> = {}
  const startsAt = Date.parse(input.startsAt)
  const endsAt = Date.parse(input.endsAt)

  if (!eventTypes.some((t) => t.id === input.typeId))
    errors.TypeId = ['Выберите категорию']
  if (!districts.some((d) => d.id === input.districtId))
    errors.DistrictId = ['Не удалось определить район']
  if (startsAt <= Date.now()) errors.StartsAt = ['Начало должно быть в будущем']
  if (endsAt <= startsAt) errors.EndsAt = ['Окончание должно быть позже начала']
  if (
    input.registrationEndsAt &&
    Date.parse(input.registrationEndsAt) > startsAt
  )
    errors.RegistrationEndsAt = ['Запись должна закрываться не позже начала']
  if (input.capacity < Math.max(1, occupied))
    errors.Capacity = [
      occupied > 0
        ? `Лимит не меньше ${occupied} занятых мест`
        : 'Укажите хотя бы одно место',
    ]

  return Object.keys(errors).length > 0 ? errors : null
}

function fromInput(input: EventInput) {
  const startsAt = Date.parse(input.startsAt)
  const type = eventTypes.find((t) => t.id === input.typeId)!
  return {
    title: input.title,
    type,
    district: districts.find((d) => d.id === input.districtId)!,
    description: input.description,
    startsAt: input.startsAt,
    endsAt: input.endsAt,
    registrationEndsAt:
      input.registrationEndsAt ?? new Date(startsAt - 24 * HOUR).toISOString(),
    address: input.address,
    location: input.location,
    meetingPoint: input.meetingPoint || undefined,
    conditions: input.conditions,
    capacity: input.capacity,
    points: pointsByType[type.id] ?? 10,
  }
}

export const organizerEventHandlers = [
  http.get('*/api/organizer/events/:id', ({ request, params }) => {
    const organizer = getOrganizer(request)
    if (organizer instanceof Response) return organizer

    const event = findOwnEvent(params.id, organizer.id)
    if (event) syncApplications(event)

    return event
      ? HttpResponse.json(event)
      : problem(404, 'Мероприятие не найдено')
  }),

  http.post('*/api/organizer/events', async ({ request }) => {
    const organizer = getOrganizer(request)
    if (organizer instanceof Response) return organizer

    const input = (await request.json()) as EventInput
    const errors = validate(input, 0)
    if (errors) return problem(400, 'Проверьте поля формы', errors)

    const event: EventDetails = {
      id: String(nextId++),
      ...fromInput(input),
      organizer: { id: organizer.id, name: organizer.name },
      organizerContacts: organizer.login, // на бэкенде — контакты из профиля
      status: 'draft',
      registeredCount: 0,
      confirmedCount: 0,
      pendingCount: 0,
    }
    events.push(event)
    return HttpResponse.json(event, { status: 201 })
  }),

  http.put('*/api/organizer/events/:id', async ({ request, params }) => {
    const organizer = getOrganizer(request)
    if (organizer instanceof Response) return organizer

    const event = findOwnEvent(params.id, organizer.id)
    if (!event) return problem(404, 'Мероприятие не найдено')
    if (event.status === 'cancelled' || event.status === 'completed')
      return problem(
        409,
        'Отменённое или завершённое мероприятие изменить нельзя'
      )
    if (event.status === 'published' && hasStarted(event))
      return problem(409, 'Мероприятие уже началось, изменить его нельзя')

    const input = (await request.json()) as EventInput
    syncApplications(event)

    const errors = validate(input, event.registeredCount)
    if (errors) return problem(400, 'Проверьте поля формы', errors)

    Object.assign(event, fromInput(input))
    syncApplications(event)

    return HttpResponse.json(event)
  }),

  http.post('*/api/organizer/events/:id/publish', ({ request, params }) => {
    const organizer = getOrganizer(request)
    if (organizer instanceof Response) return organizer

    const event = findOwnEvent(params.id, organizer.id)
    if (!event) return problem(404, 'Мероприятие не найдено')
    if (event.status !== 'draft')
      return problem(409, 'Опубликовать можно только черновик')
    if (hasStarted(event))
      return problem(409, 'Начало уже прошло — измените дату')

    event.status = 'published'
    return HttpResponse.json(event)
  }),

  http.post(
    '*/api/organizer/events/:id/cancel',
    async ({ request, params }) => {
      const organizer = getOrganizer(request)
      if (organizer instanceof Response) return organizer

      const event = findOwnEvent(params.id, organizer.id)
      if (!event) return problem(404, 'Мероприятие не найдено')
      if (event.status !== 'published')
        return problem(409, 'Отменить можно только опубликованное мероприятие')
      if (hasStarted(event)) return problem(409, 'Мероприятие уже началось')

      const { reason } = (await request.json()) as CancelEventRequest
      if (!reason?.trim())
        return problem(400, 'Проверьте поля формы', {
          Reason: ['Укажите причину отмены'],
        })

      syncApplications(event)

      event.status = 'cancelled'
      event.cancelReason = reason.trim()
      syncApplications(event)

      return HttpResponse.json(event)
    }
  ),
]
