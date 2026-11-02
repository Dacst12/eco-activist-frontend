import { http, HttpResponse } from 'msw'
import { events, toSummary } from '../data/events'

export const eventHandlers = [
  http.get('*/events', () => HttpResponse.json(events.map(toSummary))),

  http.get('*/events/:id', ({ params }) => {
    const event = events.find((e) => e.id === params.id)
    return event
      ? HttpResponse.json(event)
      : new HttpResponse(null, { status: 404 })
  }),
]
