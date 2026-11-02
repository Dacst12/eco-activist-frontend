import type { ReactNode } from 'react'

export const inputClass =
  'border-line bg-surface rounded-control h-12 w-full border px-3 focus:ring-primary focus:ring-2 focus:outline-none'

type FieldProps = { label: string; children: ReactNode }

export function Field({ label, children }: FieldProps) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-muted text-sm">{label}</span>
      {children}
    </label>
  )
}
