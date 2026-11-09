'use client'

import type { Route } from 'next'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { routes } from '@/shared/config/routes'
import { cn } from '@/shared/lib/cn'

type NavItem = {
  href: Route
  label: string
  isActive: (pathname: string) => boolean
}

const navItems: NavItem[] = [
  {
    href: routes.catalog,
    label: 'Мероприятия',
    isActive: (p) => p === '/' || p.startsWith('/events'),
  },
  {
    href: routes.myEvents,
    label: 'Мои события',
    isActive: (p) => p === '/me',
  },
  {
    href: routes.myImpact,
    label: 'Мой вклад',
    isActive: (p) => p.startsWith('/me/points'),
  },
  {
    href: routes.knowledge,
    label: 'Материалы',
    isActive: (p) => p.startsWith('/knowledge'),
  },
]

export function MainNav({ className }: { className?: string }) {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Основное меню"
      className={cn('overflow-x-auto', className)}
    >
      <ul className="flex flex-wrap gap-6 whitespace-nowrap">
        {navItems.map((item) => {
          const active = item.isActive(pathname)
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'hover:text-foreground transition-colors',
                  active ? 'text-foreground font-medium' : 'text-muted'
                )}
              >
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
