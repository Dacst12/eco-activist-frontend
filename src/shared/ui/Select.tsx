import type { SelectHTMLAttributes } from 'react'
import { cn } from '@/shared/lib/cn'
import { inputClass } from './Field'

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>

export function Select({ className, children, ...props }: SelectProps) {
  return (
    <div className="relative">
      <select
        className={cn(
          inputClass,
          'cursor-pointer appearance-none pr-12',
          className
        )}
        {...props}
      >
        {children}
      </select>
      <svg
        aria-hidden
        viewBox="0 0 16 16"
        fill="none"
        className="text-muted pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2"
      >
        <path
          d="M4 6l4 4 4-4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}
