'use client'

import { useEffect, useMemo, useSyncExternalStore } from 'react'
import {
  useFormState,
  useWatch,
  type Control,
  type FieldValues,
} from 'react-hook-form'

export type StoredDraft<T> = { values: T; savedAt: number }

export const draftStorage = {
  read: (key: string) => {
    try {
      return localStorage.getItem(key)
    } catch {
      return null
    }
  },
  write: (key: string, value: string) => {
    try {
      localStorage.setItem(key, value)
    } catch {}
  },
  remove: (key: string) => {
    try {
      localStorage.removeItem(key)
    } catch {}
  },
}

const pending = new Map<string, string | null>()
const listeners = new Set<() => void>()

const pendingDrafts = {
  subscribe: (listener: () => void) => {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },
  get: (key: string) => {
    if (!pending.has(key)) pending.set(key, draftStorage.read(key))
    return pending.get(key) ?? null
  },
  dismiss: (key: string) => {
    pending.set(key, null)
    listeners.forEach((listener) => listener())
  },
  forget: (key: string) => {
    pending.delete(key)
  },
}

const parseDraft = <T>(raw: string | null): StoredDraft<T> | null => {
  if (!raw) return null
  try {
    return JSON.parse(raw) as StoredDraft<T>
  } catch {
    return null
  }
}

export function useRestorableDraft<T>(key: string) {
  const raw = useSyncExternalStore(
    pendingDrafts.subscribe,
    () => pendingDrafts.get(key),
    () => null
  )
  useEffect(() => () => pendingDrafts.forget(key), [key])

  const draft = useMemo(() => parseDraft<T>(raw), [raw])
  return { draft, dismiss: () => pendingDrafts.dismiss(key) }
}

export function useFormAutosave<T extends FieldValues, TOutput>(
  control: Control<T, unknown, TOutput>,
  key: string,
  enabled: boolean
) {
  const values = useWatch({ control })
  const { isDirty } = useFormState({ control })

  useEffect(() => {
    if (!enabled) return
    const timer = setTimeout(() => {
      if (isDirty)
        draftStorage.write(key, JSON.stringify({ values, savedAt: Date.now() }))
      else draftStorage.remove(key)
    }, 500)
    return () => clearTimeout(timer)
  }, [values, isDirty, enabled, key])

  useEffect(() => {
    if (!isDirty) return
    const warn = (event: BeforeUnloadEvent) => event.preventDefault()
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [isDirty])
}
