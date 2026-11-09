'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import type { EventFilters } from '@/entities/event'
import { buttonClass } from '@/shared/ui'
import { catalogHref, parseSelectedEvent, type CatalogView } from '../lib/view'

type ViewSwitchProps = { filters: EventFilters; view: CatalogView }

export function ViewSwitch({ filters, view }: ViewSwitchProps) {
  const selected = parseSelectedEvent(useSearchParams().get('selected'))

  return (
    <nav aria-label="Вид каталога" className="flex gap-2">
      <Link
        href={catalogHref(filters, 'list', selected)}
        aria-current={view === 'list' ? 'page' : undefined}
        className={buttonClass(view === 'list' ? 'primary' : 'secondary')}
      >
        Список
      </Link>
      <Link
        href={catalogHref(filters, 'map', selected)}
        aria-current={view === 'map' ? 'page' : undefined}
        className={buttonClass(view === 'map' ? 'primary' : 'secondary')}
      >
        На карте
      </Link>
    </nav>
  )
}
