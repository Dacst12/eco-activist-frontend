import type { Route } from 'next'
import Link from 'next/link'
import { Badge, buttonClass } from '@/shared/ui'

export function OrganizerPending({ next }: { next: Route }) {
  return (
    <div className="flex flex-col items-start gap-4">
      <Badge tone="warning">Аккаунт на проверке</Badge>
      <h2 className="text-section font-semibold">
        Заявка организатора отправлена
      </h2>
      <p className="text-muted">
        Администратор проверит аккаунт. Пока проверка идёт, вы можете смотреть
        мероприятия, а создавать свои сможете после подтверждения.
      </p>
      <Link href={next} className={buttonClass('primary', 'mt-2')}>
        Перейти к мероприятиям
      </Link>
    </div>
  )
}
