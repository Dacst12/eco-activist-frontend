import { useId, type ComponentProps, type ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'
import { inputClass } from './Field'

type TextFieldProps = ComponentProps<'input'> & {
  label: string
  error?: string
  hint?: string
  trailing?: ReactNode
}

export function TextField({
  label,
  error,
  hint,
  trailing,
  id,
  className,
  ...inputProps
}: TextFieldProps) {
  const autoId = useId()
  const inputId = id ?? autoId
  const messageId = `${inputId}-message`
  const message = error ?? hint

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label htmlFor={inputId} className="text-muted text-sm">
        {label}
      </label>

      <div className="relative">
        <input
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          className={cn(
            inputClass,
            error && 'border-danger focus:ring-danger',
            trailing && 'pr-28'
          )}
          {...inputProps}
        />
        {trailing && (
          <div className="absolute inset-y-0 right-4 flex items-center">
            {trailing}
          </div>
        )}
      </div>

      {message && (
        <p
          id={messageId}
          className={cn('text-sm', error ? 'text-danger-text' : 'text-muted')}
        >
          {message}
        </p>
      )}
    </div>
  )
}
