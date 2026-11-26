import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  applicationQueryOptions,
  organizerApplicationsApi,
} from '@/entities/application'

export function useScanAttendance(eventId: string) {
  const client = useQueryClient()

  return useMutation({
    mutationFn: (token: string) =>
      organizerApplicationsApi.scan(eventId, token),
    retry: false,
    networkMode: 'always',

    onSuccess: ({ volunteerId }) => {
      void Promise.all([
        client.invalidateQueries({
          queryKey: ['organizer-applications', eventId],
        }),
        client.invalidateQueries({
          queryKey: applicationQueryOptions(eventId, volunteerId).queryKey,
        }),
        client.invalidateQueries({
          queryKey: ['volunteer-qr', volunteerId, eventId],
        }),
        client.invalidateQueries({
          queryKey: ['my-events', volunteerId],
        }),
      ])
    },
  })
}
