import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

type FieldFrameProps = {
  label: string
  inputId: string
  error?: string
  hint?: string
  className?: string
  children: ReactNode
}

export function FieldFrame({
  label,
  inputId,
  error,
  hint,
  className,
  children,
}: FieldFrameProps) {
  const message = error ?? hint

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label htmlFor={inputId} className="text-muted text-sm">
        {label}
      </label>

      {children}

      {message && (
        <p
          id={`${inputId}-message`}
          className={cn('text-sm', error ? 'text-danger-text' : 'text-muted')}
        >
          {message}
        </p>
      )}
    </div>
  )
}

export const fieldControlProps = (
  inputId: string,
  error?: string,
  hint?: string
) => ({
  id: inputId,
  'aria-invalid': error ? true : undefined,
  'aria-describedby': error || hint ? `${inputId}-message` : undefined,
})
