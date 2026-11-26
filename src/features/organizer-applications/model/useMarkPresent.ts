import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  applicationQueryOptions,
  organizerApplicationsApi,
  type Application,
  type ApplicationList,
} from '@/entities/application'

export function useMarkPresent(application: Application) {
  const client = useQueryClient()
  const { eventId, id, volunteer } = application
  const listKey = ['organizer-applications', eventId] as const

  return useMutation({
    mutationFn: () => organizerApplicationsApi.markPresent(eventId, id),
    retry: false,

    onSuccess: async ({ attendedAt }) => {
      client.setQueriesData<ApplicationList>({ queryKey: listKey }, (list) => {
        if (!list?.items.some((item) => item.id === id)) return list

        return {
          ...list,
          items: list.items.map((item) =>
            item.id === id ? { ...item, attendedAt } : item
          ),
        }
      })

      await Promise.all([
        client.invalidateQueries({ queryKey: listKey }),
        client.invalidateQueries({
          queryKey: applicationQueryOptions(eventId, volunteer.id).queryKey,
        }),
        client.invalidateQueries({ queryKey: ['my-events', volunteer.id] }),
      ])
    },
  })
}
