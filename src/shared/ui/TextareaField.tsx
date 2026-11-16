import { useId, type ComponentProps } from 'react'
import { cn } from '@/shared/lib/cn'
import { inputClass } from './Field'
import { FieldFrame, fieldControlProps } from './FieldFrame'

type TextareaFieldProps = ComponentProps<'textarea'> & {
  label: string
  error?: string
  hint?: string
}

export function TextareaField({
  label,
  error,
  hint,
  id,
  className,
  rows = 4,
  ...textareaProps
}: TextareaFieldProps) {
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
      <textarea
        {...fieldControlProps(inputId, error, hint)}
        rows={rows}
        className={cn(
          inputClass,
          'field-sizing-content h-auto max-h-96 min-h-28 resize-y py-3',
          error && 'border-danger focus:ring-danger'
        )}
        {...textareaProps}
      />
    </FieldFrame>
  )
}
