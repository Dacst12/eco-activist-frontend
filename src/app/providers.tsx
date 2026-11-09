'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect, useState, type ReactNode } from 'react'
import { MswProvider } from '@/mocks/MswProvider'
import { onUnauthorized } from '@/shared/api'
import { endSession } from '@/entities/user'

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 60_000, retry: 1, refetchOnWindowFocus: false },
        },
      })
  )

  useEffect(() => onUnauthorized(() => endSession(queryClient)), [queryClient])

  return (
    <MswProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </MswProvider>
  )
}
