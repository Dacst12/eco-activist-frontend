'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { useState, type ReactNode } from 'react'
import { MswProvider } from '@/mocks/MswProvider'

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 60_000, retry: 1, refetchOnWindowFocus: false },
        },
      })
  )

  return (
    <MswProvider>
      <NuqsAdapter>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </NuqsAdapter>
    </MswProvider>
  )
}
