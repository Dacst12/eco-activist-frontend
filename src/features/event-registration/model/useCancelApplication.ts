'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  applicationQueryOptions,
  applicationsApi,
} from '@/entities/application'

export function useCancelApplication(
  eventId: string,
  userId: string,
  refreshSeats: () => void
) {
  const client = useQueryClient()
  const { queryKey } = applicationQueryOptions(eventId, userId)

  return useMutation({
    mutationFn: () => applicationsApi.cancel(eventId),
    retry: false,
    onSuccess: async (application) => {
      await client.cancelQueries({ queryKey })
      client.setQueryData(queryKey, application)
      refreshSeats()
    },
    onError: async () => {
      await client.invalidateQueries({ queryKey })
      refreshSeats()
    },
  })
}
