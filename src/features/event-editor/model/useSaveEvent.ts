'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  organizerEventQueryKey,
  organizerEventsApi,
  type EventInput,
} from '@/entities/event'

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
    onSuccess: (event) =>
      queryClient.setQueryData(organizerEventQueryKey(id), event),
  })
}
