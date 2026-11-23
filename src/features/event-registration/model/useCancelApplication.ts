'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  applicationQueryOptions,
  applicationsApi,
} from '@/entities/application'
import { refreshPublicPages } from '@/features/event-editor/api/refreshPublicPages'

export function useCancelApplication(eventId: string, userId: string) {
  const client = useQueryClient()
  const { queryKey } = applicationQueryOptions(eventId, userId)

  return useMutation({
    mutationFn: () => applicationsApi.cancel(eventId),
    retry: false,

    onSuccess: async (application) => {
      await client.cancelQueries({ queryKey })
      client.setQueryData(queryKey, application)
    },

    onError: () => client.invalidateQueries({ queryKey }),

    onSettled: async () => {
      await Promise.allSettled([
        client.invalidateQueries({ queryKey: ['my-events', userId] }),
        refreshPublicPages(eventId),
      ])
    },
  })
}
