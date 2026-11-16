import Link from 'next/link'
import { routes } from '@/shared/config/routes'
import { buttonClass } from '@/shared/ui'

export function AccessDenied() {
  return (
    <section className="mx-auto max-w-md px-4 py-16 text-center">
      <h1 className="text-title font-semibold">Нет доступа</h1>
      <p className="text-muted mt-2">
        Эта страница для другой роли. Если вы вошли не в тот аккаунт, выйдите и
        войдите снова.
      </p>
      <div className="mt-4">
        <Link href={routes.catalog} className={buttonClass('primary')}>
          К мероприятиям
        </Link>
      </div>
    </section>
  )
}
