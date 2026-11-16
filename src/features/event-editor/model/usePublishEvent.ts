'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { organizerEventQueryKey, organizerEventsApi } from '@/entities/event'
import { refreshPublicPages } from '../api/refreshPublicPages'

export function usePublishEvent(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => organizerEventsApi.publish(id),
    onSuccess: async (event) => {
      queryClient.setQueryData(organizerEventQueryKey(id), event)
      await refreshPublicPages(id)
    },
  })
}
