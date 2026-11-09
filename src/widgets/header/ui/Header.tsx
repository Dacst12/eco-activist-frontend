import Link from 'next/link'
import { routes } from '@/shared/config/routes'
import { MainNav } from './MainNav'

export function Header() {
  return (
    <header className="mx-auto w-full">
      <div className="bg-surface rounded-b-card flex flex-wrap items-center gap-x-6 gap-y-3 p-8">
        <Link
          href={routes.catalog}
          className="text-primary text-subtitle font-semibold"
        >
          Эко Активист
        </Link>
        <MainNav className="order-last w-full md:order-0 md:w-auto md:flex-1" />

        <Link
          href={routes.login}
          className="text-primary ml-auto font-semibold md:ml-0"
        >
          Войти
        </Link>
      </div>
    </header>
  )
}
