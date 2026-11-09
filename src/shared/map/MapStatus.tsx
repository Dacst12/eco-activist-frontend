import { cn } from '@/shared/lib/cn'

type MapStatusProps = {
  message: string
  tone?: 'muted' | 'danger'
  className?: string
}

export function MapStatus({
  message,
  tone = 'muted',
  className,
}: MapStatusProps) {
  return (
    <div
      className={cn(
        'bg-surface border-line rounded-card flex items-center justify-center border p-6 text-center',
        tone === 'danger' ? 'text-danger-text' : 'text-muted',
        className
      )}
    >
      {message}
    </div>
  )
}
