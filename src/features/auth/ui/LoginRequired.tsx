import type { Route } from 'next'
import Link from 'next/link'
import { buttonClass } from '@/shared/ui'
import { loginHref } from '../lib/next'

export function LoginRequired({ next }: { next: Route }) {
  return (
    <section className="mx-auto max-w-md px-4 py-16 text-center">
      <h1 className="text-title font-semibold">Нужно войти</h1>
      <p className="text-muted mt-2">
        Войдите в аккаунт, чтобы открыть эту страницу.
      </p>
      <div className="mt-6">
        <Link href={loginHref(next)} className={buttonClass('primary')}>
          Войти
        </Link>
      </div>
    </section>
  )
}
