import { authHandlers } from './auth'
import { dictionaryHandlers } from './dictionaries'
import { eventHandlers } from './events'
import { organizerEventHandlers } from './organizer-events'
import { applicationHandlers } from './applications'

export const handlers = [
  ...eventHandlers,
  ...organizerEventHandlers,
  ...dictionaryHandlers,
  ...authHandlers,
  ...applicationHandlers,
]
