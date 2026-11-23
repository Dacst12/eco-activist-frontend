import Link from 'next/link'
import type { MyEventsPage, MyEventsSection } from '@/entities/application'
import { routes } from '@/shared/config/routes'
import { Button, buttonClass } from '@/shared/ui'
import { ActiveEventCard } from './ActiveEventCard'
import { ActiveEventsPreview } from './ActiveEventsPreview'
import { EventHistory } from './EventHistory'

type Props = {
  data: MyEventsPage
  section: MyEventsSection
  onPageChange: (page: number) => void
  preview: boolean
  asOf: number
}

export function MyEventsResults({
  data,
  section,
  onPageChange,
  preview,
  asOf,
}: Props) {
  const { items, page, pageSize, total } = data
  const pages = Math.max(1, Math.ceil(total / pageSize))

  if (page > pages) {
    return (
      <div className="space-y-3">
        <p>На этой странице больше нет мероприятий.</p>
        <Button variant="secondary" onClick={() => onPageChange(pages)}>
          К последней странице
        </Button>
      </div>
    )
  }

  if (!items.length) {
    return section === 'active' ? (
      <div className="space-y-3">
        <p>У вас пока нет активных мероприятий.</p>
        <Link href={routes.catalog} className={buttonClass('primary')}>
          Перейти в каталог
        </Link>
      </div>
    ) : (
      <p>История мероприятий пока пуста.</p>
    )
  }

  if (preview && section === 'active') {
    return <ActiveEventsPreview items={items} asOf={asOf} />
  }

  return (
    <>
      {section === 'active' ? (
        <ul className="grid gap-4">
          {items.map((item) => (
            <li key={item.application.id}>
              <ActiveEventCard item={item} asOf={asOf} />
            </li>
          ))}
        </ul>
      ) : (
        <EventHistory items={preview ? items.slice(0, 3) : items} />
      )}

      {!preview && pages > 1 && (
        <nav
          aria-label="Страницы мероприятий"
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <Button
            variant="secondary"
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
          >
            Назад
          </Button>

          <span>
            Страница {page} из {pages}
          </span>

          <Button
            variant="secondary"
            disabled={page >= pages}
            onClick={() => onPageChange(page + 1)}
          >
            Далее
          </Button>
        </nav>
      )}
    </>
  )
}
