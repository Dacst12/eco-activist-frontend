import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  applicationQueryOptions,
  organizerApplicationsApi,
  type Application,
} from '@/entities/application'
import { organizerEventQueryKey } from '@/entities/event'
import { refreshPublicPages } from '@/features/event-editor/api/refreshPublicPages'

export function useReviewApplication(application: Application) {
  const client = useQueryClient()
  const { eventId, id, volunteer } = application

  return useMutation({
    retry: false,

    mutationFn: (action: 'confirm' | 'reject') =>
      organizerApplicationsApi[action](eventId, id),

    onSettled: async (updated) => {
      const { queryKey } = applicationQueryOptions(eventId, volunteer.id)

      if (updated) client.setQueryData(queryKey, updated)

      await Promise.allSettled([
        client.invalidateQueries({
          queryKey: ['organizer-applications', eventId],
        }),
        client.invalidateQueries({
          queryKey: organizerEventQueryKey(eventId),
        }),
        client.invalidateQueries({ queryKey }),
        refreshPublicPages(eventId),
      ])
    },
  })
}
