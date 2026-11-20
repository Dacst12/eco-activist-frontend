import { http, HttpResponse } from 'msw'
import { toCityDateKey } from '@/shared/lib/date'
import { events, toSummary } from '../data/events'
import { syncApplications } from '../lib/applications'

export const eventHandlers = [
  http.get('*/api/events', ({ request }) => {
    events.forEach((event) => syncApplications(event))

    const params = new URL(request.url).searchParams
    const type = params.get('type')
    const district = params.get('district')
    const from = params.get('from')
    const to = params.get('to')

    const result = events
      .filter((event) => {
        const date = toCityDateKey(event.startsAt)
        return (
          event.status === 'published' &&
          (!type || event.type.id === type) &&
          (!district || event.district.id === district) &&
          (!from || date >= from) &&
          (!to || date <= to)
        )
      })

      .sort(
        (a, b) =>
          new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
      )

    return HttpResponse.json(result.map(toSummary))
  }),

  http.get('*/api/events/:id', ({ params }) => {
    const event = events.find((e) => e.id === params.id)
    if (event) syncApplications(event)

    return event && event.status !== 'draft'
      ? HttpResponse.json(event)
      : new HttpResponse(null, { status: 404 })
  }),
]
