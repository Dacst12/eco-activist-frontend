import { useId, type ComponentProps, type ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'
import { inputClass } from './Field'
import { FieldFrame, fieldControlProps } from './FieldFrame'

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

  return (
    <FieldFrame
      label={label}
      inputId={inputId}
      error={error}
      hint={hint}
      className={className}
    >
      <div className="relative">
        <input
          {...fieldControlProps(inputId, error, hint)}
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
    </FieldFrame>
  )
}
