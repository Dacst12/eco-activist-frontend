import { authHandlers } from './auth'
import { dictionaryHandlers } from './dictionaries'
import { eventHandlers } from './events'

export const handlers = [
  ...eventHandlers,
  ...dictionaryHandlers,
  ...authHandlers,
]
