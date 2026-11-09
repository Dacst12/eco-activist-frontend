'use client'

import type { Route } from 'next'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { useSession } from '@/entities/user'

export function useRedirectIfAuthenticated(next: Route) {
  const { data: user, isPending } = useSession()
  const router = useRouter()
  const checked = useRef(false)

  useEffect(() => {
    if (isPending || checked.current) return
    checked.current = true
    if (user) router.replace(next)
  }, [isPending, user, next, router])
}
