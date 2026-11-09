'use client'

import { useEffect, useState } from 'react'
import { loadYandexMaps, type YandexMaps } from './loader'

type State =
  | { status: 'loading' }
  | { status: 'ready'; maps: YandexMaps }
  | { status: 'error'; message: string }

export function useYandexMaps(): State {
  const [state, setState] = useState<State>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false
    loadYandexMaps()
      .then((maps) => !cancelled && setState({ status: 'ready', maps }))
      .catch(
        (error: Error) =>
          !cancelled && setState({ status: 'error', message: error.message })
      )
    return () => {
      cancelled = true
    }
  }, [])

  return state
}
