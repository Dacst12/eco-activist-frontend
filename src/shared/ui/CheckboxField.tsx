import { useId, type ComponentProps, type ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

type CheckboxFieldProps = Omit<ComponentProps<'input'>, 'type'> & {
  label: ReactNode
  error?: string
}

export function CheckboxField({
  label,
  error,
  id,
  className,
  ...inputProps
}: CheckboxFieldProps) {
  const autoId = useId()
  const inputId = id ?? autoId
  const errorId = `${inputId}-error`

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <label htmlFor={inputId} className="flex items-start gap-2">
        <input
          id={inputId}
          type="checkbox"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className="accent-primary mt-1 size-4 shrink-0"
          {...inputProps}
        />
        <span>{label}</span>
      </label>
      {error && (
        <p id={errorId} className="text-danger-text text-sm">
          {error}
        </p>
      )}
    </div>
  )
}
