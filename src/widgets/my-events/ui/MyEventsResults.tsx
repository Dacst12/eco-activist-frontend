import Link from 'next/link'
import {
  applicationStatusConfig,
  type MyEventsPage,
  type MyEventsSection,
} from '@/entities/application'
import { routes } from '@/shared/config/routes'
import { formatDateTime } from '@/shared/lib/date'
import { Badge, Button, buttonClass } from '@/shared/ui'
import { ActiveEventCard } from './ActiveEventCard'
import { ActiveEventsPreview } from './ActiveEventsPreview'

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
          {(preview ? items.slice(0, 1) : items).map((item) => (
            <li key={item.application.id}>
              <ActiveEventCard item={item} asOf={asOf} />
            </li>
          ))}
        </ul>
      ) : (
        <ul className="space-y-2">
          {items.map(({ event, application }) => (
            <li
              key={application.id}
              className="bg-surface rounded-control flex flex-wrap items-center justify-between gap-3 p-4"
            >
              <div className="min-w-0">
                <Link
                  href={`/events/${encodeURIComponent(event.id)}`}
                  className="text-primary font-semibold wrap-anywhere hover:underline"
                >
                  {event.title}
                </Link>
                <p className="text-muted text-sm">
                  {formatDateTime(event.startsAt)}
                </p>
              </div>

              <Badge tone={applicationStatusConfig[application.status].tone}>
                {applicationStatusConfig[application.status].label}
              </Badge>
            </li>
          ))}
        </ul>
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
