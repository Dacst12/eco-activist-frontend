import { http, HttpResponse } from 'msw'
import { applicationStatuses } from '@/entities/application'
import type {
  Application,
  ApplicationList,
  ApplicationStatus,
} from '@/entities/application'
import type { EventDetails } from '@/entities/event'
import type { UserRole } from '@/entities/user'
import { applications } from '../data/applications'
import { events } from '../data/events'
import { users } from '../data/users'
import {
  applicationNotifications,
  setApplicationStatus,
  syncApplications,
} from '../lib/applications'
import { readAccessToken } from '../lib/tokens'

const problem = (status: number, title: string, code: string) =>
  HttpResponse.json({ status, title, code }, { status })

function currentUser(request: Request, role: UserRole) {
  const id = readAccessToken(request.headers.get('Authorization'))
  const user = users.find((item) => item.id === id)

  if (!user) return problem(401, 'Требуется вход', 'unauthorized')
  if (
    user.role !== role ||
    (role === 'organizer' && user.organizerStatus !== 'approved')
  ) {
    return problem(403, 'Нет доступа', 'forbidden')
  }

  return user
}

function publicEvent(id: unknown) {
  return events.find((event) => event.id === id && event.status !== 'draft')
}

const notFound = () =>
  problem(404, 'Мероприятие или заявка не найдены', 'not_found')

const beforeStart = (event: EventDetails, now: number) =>
  event.status === 'published' && now < Date.parse(event.startsAt)

const isOpen = (event: EventDetails, now: number) =>
  beforeStart(event, now) && now < Date.parse(event.registrationEndsAt)

let nextId = 1

export const applicationHandlers = [
  http.get('*/api/events/:eventId/application', ({ request, params }) => {
    const user = currentUser(request, 'volunteer')
    if (user instanceof Response) return user

    const event = publicEvent(params.eventId)
    if (!event) return notFound()

    const rows = syncApplications(event)
    return HttpResponse.json(
      rows.find((item) => item.volunteer.id === user.id) ?? null
    )
  }),

  http.post('*/api/events/:eventId/applications', ({ request, params }) => {
    const user = currentUser(request, 'volunteer')
    if (user instanceof Response) return user

    const event = publicEvent(params.eventId)
    if (!event) return notFound()

    const now = Date.now()
    const rows = syncApplications(event, now)
    const existing = rows.find((item) => item.volunteer.id === user.id)

    if (existing && existing.status !== 'cancelled') {
      return problem(
        409,
        'Заявка уже существует. Проверьте её статус',
        'application_exists'
      )
    }
    if (!isOpen(event, now))
      return problem(409, 'Запись закрыта', 'registration_closed')
    if (event.registeredCount >= event.capacity)
      return problem(409, 'Свободных мест нет', 'no_seats')

    // Проверка и резервирование выполняются синхронно в одном процессе.
    const submittedAt = new Date(now).toISOString()
    const application: Application = existing ?? {
      id: `application-${nextId++}`,
      eventId: event.id,
      volunteer: { id: user.id, name: user.name, contact: user.login },
      status: 'pending',
      createdAt: submittedAt,
      updatedAt: submittedAt,
    }

    if (existing) {
      setApplicationStatus(existing, 'pending', now)
      existing.createdAt = submittedAt
    } else {
      applications.push(application)
    }

    syncApplications(event, now)
    return HttpResponse.json(application, { status: existing ? 200 : 201 })
  }),

  http.post(
    '*/api/events/:eventId/application/cancel',
    ({ request, params }) => {
      const user = currentUser(request, 'volunteer')
      if (user instanceof Response) return user

      const event = publicEvent(params.eventId)
      if (!event) return notFound()

      const now = Date.now()
      const application = syncApplications(event, now).find(
        (item) => item.volunteer.id === user.id
      )

      if (!application) return notFound()
      if (application.status === 'cancelled')
        return HttpResponse.json(application)
      if (
        !beforeStart(event, now) ||
        !['pending', 'confirmed'].includes(application.status)
      ) {
        return problem(409, 'Отменить участие уже нельзя', 'invalid_transition')
      }

      setApplicationStatus(application, 'cancelled', now)
      syncApplications(event, now)
      return HttpResponse.json(application)
    }
  ),

  http.get(
    '*/api/organizer/events/:eventId/applications',
    ({ request, params }) => {
      const user = currentUser(request, 'organizer')
      if (user instanceof Response) return user

      const event = events.find(
        (item) => item.id === params.eventId && item.organizer.id === user.id
      )
      if (!event) return notFound()

      const query = new URL(request.url).searchParams
      const status = query.get('status')
      const page = Number(query.get('page') ?? 1)
      const pageSize = Number(query.get('pageSize') ?? 20)

      if (
        !Number.isSafeInteger(page) ||
        page < 1 ||
        !Number.isSafeInteger(pageSize) ||
        pageSize < 1 ||
        pageSize > 100 ||
        (status !== null &&
          !applicationStatuses.includes(status as ApplicationStatus))
      ) {
        return problem(400, 'Некорректные параметры списка', 'invalid_query')
      }

      const rows = syncApplications(event)
      const statusCounts = Object.fromEntries(
        applicationStatuses.map((s) => [
          s,
          rows.filter((item) => item.status === s).length,
        ])
      ) as ApplicationList['statusCounts']

      const filtered = rows
        .filter((item) => !status || item.status === status)
        .sort(
          (a, b) =>
            a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id)
        )

      return HttpResponse.json({
        items: filtered.slice((page - 1) * pageSize, page * pageSize),
        total: filtered.length,
        page,
        pageSize,
        statusCounts,
        seats: {
          capacity: event.capacity,
          confirmed: event.confirmedCount,
          pending: event.pendingCount,
          free: Math.max(0, event.capacity - event.registeredCount),
        },
        registrationEndsAt: event.registrationEndsAt,
      } satisfies ApplicationList)
    }
  ),

  ...(['confirm', 'reject', 'remove'] as const).map((action) =>
    http.post(
      `*/api/organizer/events/:eventId/applications/:id/${action}`,
      ({ request, params }) => {
        const user = currentUser(request, 'organizer')
        if (user instanceof Response) return user

        const event = events.find(
          (item) => item.id === params.eventId && item.organizer.id === user.id
        )
        if (!event) return notFound()

        const now = Date.now()
        const application = syncApplications(event, now).find(
          (item) => item.id === params.id
        )
        if (!application) return notFound()

        const allowed =
          action === 'remove'
            ? beforeStart(event, now) && application.status === 'confirmed'
            : isOpen(event, now) && application.status === 'pending'
        if (!allowed) {
          return problem(
            409,
            'Действие для этой заявки недоступно',
            'invalid_transition'
          )
        }

        const status = {
          confirm: 'confirmed',
          reject: 'rejected',
          remove: 'removed',
        } as const

        setApplicationStatus(application, status[action], now)

        if (action === 'remove') {
          applicationNotifications.push({
            type: 'participant_removed',
            applicationId: application.id,
            eventId: event.id,
            userId: application.volunteer.id,
            createdAt: application.updatedAt,
          })
        }

        syncApplications(event, now)
        return HttpResponse.json(application)
      }
    )
  ),
]
