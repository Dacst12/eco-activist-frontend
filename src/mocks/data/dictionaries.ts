import type { DictionaryItem } from '@/entities/dictionary'

export const eventTypes: DictionaryItem[] = [
  { id: '1', name: 'Субботник' },
  { id: '2', name: 'Сбор вторсырья' },
  { id: '3', name: 'Посадка деревьев' },
  { id: '4', name: 'Экоквест' },
  { id: '5', name: 'Лекция' },
]

export const districts: DictionaryItem[] = [
  { id: '1', name: 'Центральный' },
  { id: '2', name: 'Северный' },
  { id: '3', name: 'Южный' },
]

export const organizers: DictionaryItem[] = [
  { id: '1', name: 'Зелёный город' },
  { id: '2', name: 'Эковолонтёры вуза' },
  { id: '3', name: 'Чистый берег' },
]
