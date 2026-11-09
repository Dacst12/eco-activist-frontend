'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { authApi, endSession } from '@/entities/user'
import { routes } from '@/shared/config/routes'

export function useLogout() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      endSession(queryClient)
      router.push(routes.catalog)
    },
  })
}
