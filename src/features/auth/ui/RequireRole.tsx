'use client'

import type { Route } from 'next'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, type ReactNode } from 'react'
import { useSession, type UserRole } from '@/entities/user'
import { getAccess } from '../lib/access'
import { organizerPendingHref } from '../lib/role'
import { AccessDenied } from './AccessDenied'
import { LoginRequired } from './LoginRequired'
import { loginHref } from '@/shared/lib/url'

type RequireRoleProps = {
  roles: readonly UserRole[]
  children: ReactNode
}

export function RequireRole({ roles, children }: RequireRoleProps) {
  const { data: user, isPending } = useSession()
  const router = useRouter()
  const pathname = usePathname() as Route

  const access = isPending ? null : getAccess(user ?? null, roles)

  const checked = useRef(false)
  useEffect(() => {
    if (!access || checked.current) return
    checked.current = true
    if (access === 'login') router.replace(loginHref(pathname))
    if (access === 'pending') router.replace(organizerPendingHref(pathname))
  }, [access, pathname, router])

  if (access === 'allow') return children
  if (access === 'forbidden') return <AccessDenied />
  if (access === 'login') return <LoginRequired next={pathname} />
  return <p className="text-muted py-16 text-center">Загрузка…</p>
}
