import Link from 'next/link'
import { buttonClass } from '@/shared/ui'

export default function EventNotFound() {
  return (
    <main className="mx-auto flex flex-1 flex-col items-center justify-center px-4 py-12">
      <h1 className="text-title font-semibold">Мероприятие не найдено</h1>
      <p className="text-muted mt-2">
        Возможно, его удалили или ссылка устарела.
      </p>
      <Link href="/" className={buttonClass('primary', 'mt-6')}>
        Все мероприятия
      </Link>
    </main>
  )
}
