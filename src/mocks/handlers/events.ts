import { http, HttpResponse } from 'msw'
import { toCityDateKey } from '@/shared/lib/date'
import { events, toSummary } from '../data/events'

export const eventHandlers = [
  http.get('*/events', ({ request }) => {
    const params = new URL(request.url).searchParams
    const type = params.get('type')
    const district = params.get('district')
    const organizer = params.get('organizer')
    const from = params.get('from')
    const to = params.get('to')
    const seats = params.get('seats')

    const result = events.filter((event) => {
      const date = toCityDateKey(event.startsAt)
      return (
        (!type || event.type.id === type) &&
        (!district || event.district.id === district) &&
        (!organizer || event.organizer.id === organizer) &&
        (!from || date >= from) &&
        (!to || date <= to) &&
        (!seats || event.registeredCount < event.capacity)
      )
    })

    return HttpResponse.json(result.map(toSummary))
  }),

  http.get('*/events/:id', ({ params }) => {
    const event = events.find((e) => e.id === params.id)
    return event
      ? HttpResponse.json(event)
      : new HttpResponse(null, { status: 404 })
  }),
]
