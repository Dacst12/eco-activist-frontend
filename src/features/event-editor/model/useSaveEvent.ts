'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  organizerEventQueryKey,
  organizerEventsApi,
  type EventInput,
} from '@/entities/event'
import { refreshPublicPages } from '../api/refreshPublicPages'

export function useCreateEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: EventInput) => organizerEventsApi.create(data),
    onSuccess: (event) =>
      queryClient.setQueryData(organizerEventQueryKey(event.id), event),
  })
}

export function useUpdateEvent(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: EventInput) => organizerEventsApi.update(id, data),
    onSuccess: async (event) => {
      queryClient.setQueryData(organizerEventQueryKey(id), event)
      if (event.status === 'published') await refreshPublicPages(id)
    },
  })
}
