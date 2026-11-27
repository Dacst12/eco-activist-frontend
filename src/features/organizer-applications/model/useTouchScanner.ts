import { useSyncExternalStore } from 'react'

const query = '(pointer: coarse) and (hover: none)'

function subscribe(notify: () => void) {
  const media = window.matchMedia(query)
  media.addEventListener('change', notify)

  return () => media.removeEventListener('change', notify)
}

export function useTouchScanner() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  )
}
