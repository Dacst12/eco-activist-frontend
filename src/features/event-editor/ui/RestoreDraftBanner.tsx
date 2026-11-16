import { cn } from '@/shared/lib/cn'
import { buttonClass } from '@/shared/ui'

type RestoreDraftBannerProps = {
  savedAt: number
  onRestore: () => void
  onDiscard: () => void
}

export function RestoreDraftBanner({
  savedAt,
  onRestore,
  onDiscard,
}: RestoreDraftBannerProps) {
  const time = new Date(savedAt).toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="bg-warning-soft rounded-card flex flex-wrap items-center justify-between gap-4 p-4">
      <p>
        <span className="font-semibold">Есть несохранённые изменения</span>
        <span className="text-warning-text"> от {time}</span>
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onRestore}
          className={cn(buttonClass('primary'), 'h-10')}
        >
          Восстановить
        </button>
        <button
          type="button"
          onClick={onDiscard}
          className={cn(buttonClass('secondary'), 'h-10')}
        >
          Начать заново
        </button>
      </div>
    </div>
  )
}
