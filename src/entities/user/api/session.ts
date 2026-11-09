'use client'

import { useQuery, type QueryClient } from '@tanstack/react-query'
import { isUnauthorized, setAccessToken } from '@/shared/api'
import type { AuthResponse, User } from '../model/types'
import { authApi } from './auth'

export const sessionQueryKey = ['session'] as const

export function useSession() {
  return useQuery<User | null>({
    queryKey: sessionQueryKey,
    queryFn: async () => {
      try {
        return await authApi.me()
      } catch (error) {
        if (isUnauthorized(error)) return null
        throw error
      }
    },
    staleTime: Infinity,
    retry: false,
  })
}

export const startSession = (
  queryClient: QueryClient,
  { accessToken, user }: AuthResponse
) => {
  setAccessToken(accessToken)
  queryClient.setQueryData(sessionQueryKey, user)
}

export const endSession = (queryClient: QueryClient) => {
  setAccessToken(null)
  queryClient.removeQueries({
    predicate: (query) => query.queryKey[0] !== sessionQueryKey[0],
  })
  queryClient.setQueryData(sessionQueryKey, null)
}
