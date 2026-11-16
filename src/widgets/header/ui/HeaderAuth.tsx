'use client'

import type { Route } from 'next'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { useSession } from '@/entities/user'
import { loginHref } from '@/features/auth'
import { UserMenu } from './UserMenu'

export function HeaderAuth() {
  const { data: user, isPending } = useSession()
  const pathname = usePathname()
  const search = useSearchParams().toString()

  if (isPending) return <div aria-hidden className="h-11 w-28" />

  if (user) return <UserMenu user={user} />

  const next = (search ? `${pathname}?${search}` : pathname) as Route

  return (
    <Link
      href={loginHref(next)}
      className="text-primary font-semibold transition-opacity hover:opacity-80"
    >
      Войти
    </Link>
  )
}
