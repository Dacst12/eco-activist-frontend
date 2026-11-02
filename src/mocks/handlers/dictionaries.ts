import { http, HttpResponse } from 'msw'
import { districts, eventTypes, organizers } from '../data/dictionaries'

export const dictionaryHandlers = [
  http.get('*/api/dictionaries/event-types', () =>
    HttpResponse.json(eventTypes)
  ),
  http.get('*/api/dictionaries/districts', () => HttpResponse.json(districts)),
  http.get('*/api/organizers', () => HttpResponse.json(organizers)),
]
