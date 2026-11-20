'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import {
  applicationQueryOptions,
  applicationsApi,
} from '@/entities/application'
import { getProblem } from '@/shared/api'

export function useSubmitApplication(
  eventId: string,
  userId: string,
  refreshSeats: () => void
) {
  const queryClient = useQueryClient()
  const query = applicationQueryOptions(eventId, userId)

  return useMutation({
    retry: false,
    mutationFn: async () => {
      try {
        return await applicationsApi.create(eventId)
      } catch (error) {
        const conflict = getProblem(error)?.code === 'application_exists'
        const unknownResult =
          isAxiosError(error) &&
          (!error.response || error.response.status >= 500)

        if (conflict || unknownResult) {
          await queryClient.cancelQueries({ queryKey: query.queryKey })
          const application = await queryClient.fetchQuery(query)
          if (application && application.status !== 'cancelled') {
            return application
          }
        }

        throw error
      }
    },
    onSuccess: (application) => {
      queryClient.setQueryData(query.queryKey, application)
      refreshSeats()
    },
    onError: (error) => {
      const code = getProblem(error)?.code
      if (code === 'no_seats' || code === 'registration_closed') refreshSeats()
    },
  })
}
