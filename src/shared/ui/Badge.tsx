import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

export type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger'

const tones: Record<BadgeTone, string> = {
  neutral: 'bg-page text-muted',
  success: 'bg-success-soft text-success-text',
  warning: 'bg-warning-soft text-warning-text',
  danger: 'bg-danger-soft text-danger-text',
}

type BadgeProps = { tone?: BadgeTone; className?: string; children: ReactNode }

export function Badge({ tone = 'neutral', className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'rounded-control inline-flex px-3 py-1 text-sm',
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  )
}
