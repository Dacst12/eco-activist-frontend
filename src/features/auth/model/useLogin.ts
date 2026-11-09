'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Route } from 'next'
import { useRouter } from 'next/navigation'
import { authApi, startSession } from '@/entities/user'

export function useLogin(next: Route) {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      startSession(queryClient, data)
      router.replace(next)
    },
  })
}
