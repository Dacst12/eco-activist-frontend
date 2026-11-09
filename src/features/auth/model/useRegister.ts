'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi, startSession, type RegisterRequest } from '@/entities/user'

export function useRegister() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: (data) => startSession(queryClient, data),
  })
}
