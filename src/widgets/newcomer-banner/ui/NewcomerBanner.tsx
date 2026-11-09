import Link from 'next/link'
import { routes } from '@/shared/config/routes'
import { cn } from '@/shared/lib/cn'
import { buttonClass } from '@/shared/ui'

export function NewcomerBanner({ className }: { className?: string }) {
  return (
    <section
      className={cn(
        'bg-surface rounded-card flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between',
        className
      )}
    >
      <div>
        <h2 className="text-subtitle font-semibold">Первый раз на акции?</h2>
        <p className="text-muted mt-2">
          Узнайте, как подготовиться: одежда, безопасность и правила участия.
        </p>
      </div>

      <Link
        href={routes.knowledge}
        className={buttonClass('secondary', 'border-line shrink-0 border')}
      >
        Читать материалы
      </Link>
    </section>
  )
}
