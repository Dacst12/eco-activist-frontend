import 'server-only'
import { serverApi } from '@/shared/api/server'
import type { DictionaryItem } from '../model/types'

const DICTIONARY_REVALIDATE = 600

export const getEventTypes = () =>
  serverApi<DictionaryItem[]>('/dictionaries/event-types', {
    revalidate: DICTIONARY_REVALIDATE,
  })

export const getDistricts = () =>
  serverApi<DictionaryItem[]>('/dictionaries/districts', {
    revalidate: DICTIONARY_REVALIDATE,
  })
