import Link from 'next/link'
import { routes } from '@/shared/config/routes'
import { MainNav } from './MainNav'
import { HeaderAuth } from './HeaderAuth'

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

        <div className="ml-auto md:ml-0">
          <HeaderAuth />
        </div>
      </div>
    </header>
  )
}
