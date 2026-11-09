'use client'

import type { Route } from 'next'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { useSession } from '@/entities/user'
import { useLogout } from '@/features/auth'
import { routes } from '@/shared/config/routes'

export function HeaderAuth() {
  const { data: user, isPending } = useSession()
  const logout = useLogout()
  const pathname = usePathname()
  const search = useSearchParams().toString()

  if (isPending) return <HeaderAuthPlaceholder />

  if (!user) {
    const current = search ? `${pathname}?${search}` : pathname
    const href =
      pathname === routes.login
        ? routes.login
        : (`${routes.login}?next=${encodeURIComponent(current)}` as Route)

    return (
      <Link href={href} className="text-primary font-semibold">
        Войти
      </Link>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <span className="font-medium">{user.name}</span>
      <button
        type="button"
        onClick={() => logout.mutate()}
        disabled={logout.isPending}
        className="text-muted hover:text-foreground"
      >
        Выйти
      </button>
    </div>
  )
}

export function HeaderAuthPlaceholder() {
  return (
    <span
      className="bg-page block h-6 w-24 animate-pulse rounded"
      aria-hidden
    />
  )
}
