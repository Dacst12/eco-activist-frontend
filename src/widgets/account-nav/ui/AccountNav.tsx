'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { routes } from '@/shared/config/routes'

export function AccountNav() {
  const path = usePathname()
  const active = path === routes.myEvents

  if (!active && path !== routes.myEventsHistory) return null

  return (
    <nav
      aria-label="Разделы кабинета"
      className="border-line text-primary flex flex-wrap items-center justify-between gap-x-4 border-b font-medium"
    >
      <Link
        href={routes.account}
        className="inline-flex min-h-11 items-center hover:underline"
      >
        ← В кабинет
      </Link>

      <Link
        href={active ? routes.myEventsHistory : routes.myEvents}
        className="inline-flex min-h-11 items-center hover:underline"
      >
        {active ? 'История мероприятий' : 'Активные мероприятия'} →
      </Link>
    </nav>
  )
}
