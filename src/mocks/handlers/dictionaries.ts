import { http, HttpResponse } from 'msw'
import { districts, eventTypes, organizers } from '../data/dictionaries'

export const dictionaryHandlers = [
  http.get('*/dictionaries/event-types', () => HttpResponse.json(eventTypes)),
  http.get('*/dictionaries/districts', () => HttpResponse.json(districts)),
  http.get('*/organizers', () => HttpResponse.json(organizers)),
]
