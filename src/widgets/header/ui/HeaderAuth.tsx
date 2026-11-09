'use client'

import Link from 'next/link'
import { useSession } from '@/entities/user'
import { useLogout } from '@/features/auth'
import { routes } from '@/shared/config/routes'

export function HeaderAuth() {
  const { data: user, isPending } = useSession()
  const logout = useLogout()

  if (isPending)
    return (
      <span className="bg-page h-6 w-24 animate-pulse rounded" aria-hidden />
    )

  if (!user) {
    return (
      <Link href={routes.login} className="text-primary font-semibold">
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
