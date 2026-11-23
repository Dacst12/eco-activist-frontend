'use client'

import { useEffect, useId, useRef, useState } from 'react'
import {
  applicationStatusConfig,
  type ApplicationStatus,
} from '@/entities/application'
import { CITY_TIMEZONE_LABEL } from '@/shared/config/locale'
import { formatDateTime } from '@/shared/lib/date'
import { Badge } from '@/shared/ui'

export function ApplicationStatusBlock({
  status,
  registrationEndsAt,
}: {
  status: ApplicationStatus
  registrationEndsAt: string
}) {
  const [open, setOpen] = useState(false)
  const tooltipId = useId()
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    function dismiss(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false)
    }

    function escape(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', dismiss)
    document.addEventListener('keydown', escape)

    return () => {
      document.removeEventListener('pointerdown', dismiss)
      document.removeEventListener('keydown', escape)
    }
  }, [open])

  const { label, tone } = applicationStatusConfig[status]

  const messages: Record<ApplicationStatus, string> = {
    pending: `Место зарезервировано. Организатор рассмотрит заявку до ${formatDateTime(registrationEndsAt)} (${CITY_TIMEZONE_LABEL}).`,
    confirmed: 'Организатор подтвердил ваше участие.',
    rejected: 'Организатор отклонил заявку. Место освобождено.',
    removed: 'Организатор снял вас с мероприятия. Место освобождено.',
    cancelled: 'Вы отменили участие. Место освобождено.',
    expired:
      'Организатор не принял решение до закрытия записи. Место освобождено.',
    event_cancelled: 'Ваша заявка отменена вместе с мероприятием.',
  }

  return (
    <div ref={root} className="relative w-full">
      <Badge
        tone={tone}
        className="w-full items-center justify-between px-2 py-2"
      >
        <span role="status">{label}</span>

        <button
          type="button"
          aria-label="Подробнее о статусе заявки"
          aria-describedby={tooltipId}
          className="focus-visible:outline-primary inline-flex size-4 shrink-0 cursor-help items-center justify-center rounded-full border border-current text-xs font-semibold focus-visible:outline-2"
          onPointerEnter={(event) => {
            if (event.pointerType === 'mouse') setOpen(true)
          }}
          onPointerLeave={(event) => {
            if (event.pointerType === 'mouse') setOpen(false)
          }}
          onFocus={(event) => {
            if (event.currentTarget.matches(':focus-visible')) setOpen(true)
          }}
          onBlur={() => setOpen(false)}
          onClick={() => setOpen(true)}
        >
          i
        </button>
      </Badge>

      <div
        id={tooltipId}
        role="tooltip"
        hidden={!open}
        className="absolute top-full right-0 z-20 w-max max-w-full pt-1 sm:max-w-[min(20rem,100%)]"
      >
        <p className="bg-foreground text-surface rounded-control px-3 py-2 text-sm shadow-md">
          {messages[status]}
        </p>
      </div>
    </div>
  )
}
