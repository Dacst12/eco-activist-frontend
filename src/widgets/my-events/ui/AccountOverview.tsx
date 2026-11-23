import Link from 'next/link'
import { routes } from '@/shared/config/routes'
import { MyEvents } from './MyEvents'

export function AccountOverview() {
  return (
    <div className="space-y-8">
      <h1 className="text-title font-semibold">Кабинет волонтёра</h1>

      <section>
        <div className="flex flex-wrap items-center justify-between gap-x-4">
          <h2 className="text-xl font-semibold">Активные мероприятия</h2>

          <Link
            href={routes.myEvents}
            className="text-primary inline-flex min-h-11 items-center font-medium hover:underline"
          >
            Все активные →
          </Link>
        </div>

        <MyEvents section="active" preview />
      </section>

      <section>
        <div className="flex flex-wrap items-center justify-between gap-x-4">
          <h2 className="text-xl font-semibold">Последние записи в истории</h2>

          <Link
            href={routes.myEventsHistory}
            className="text-primary inline-flex min-h-11 items-center font-medium hover:underline"
          >
            Вся история →
          </Link>
        </div>

        <MyEvents section="history" preview />
      </section>
    </div>
  )
}
