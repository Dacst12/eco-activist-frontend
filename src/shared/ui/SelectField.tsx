import { useId, type ComponentProps } from 'react'
import { cn } from '@/shared/lib/cn'
import { FieldFrame, fieldControlProps } from './FieldFrame'
import { Select } from './Select'

type SelectFieldProps = ComponentProps<typeof Select> & {
  label: string
  error?: string
  hint?: string
  placeholder?: string
}

export function SelectField({
  label,
  error,
  hint,
  placeholder,
  id,
  className,
  children,
  ...selectProps
}: SelectFieldProps) {
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
      <Select
        {...fieldControlProps(inputId, error, hint)}
        className={cn(error && 'border-danger focus:ring-danger')}
        {...selectProps}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {children}
      </Select>
    </FieldFrame>
  )
}
