import { authHandlers } from './auth'
import { dictionaryHandlers } from './dictionaries'
import { eventHandlers } from './events'
import { organizerEventHandlers } from './organizer-events'

export const handlers = [
  ...eventHandlers,
  ...organizerEventHandlers,
  ...dictionaryHandlers,
  ...authHandlers,
]
