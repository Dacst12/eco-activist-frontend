'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  organizerEventQueryKey,
  organizerEventsApi,
  type CancelEventRequest,
} from '@/entities/event'
import { refreshPublicPages } from '../api/refreshPublicPages'

export function useCancelEvent(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CancelEventRequest) =>
      organizerEventsApi.cancel(id, data),
    onSuccess: async (event) => {
      queryClient.setQueryData(organizerEventQueryKey(id), event)
      await refreshPublicPages(id)
    },
  })
}
