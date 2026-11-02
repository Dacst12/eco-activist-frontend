'use client'

import { useEffect, useRef, useState } from 'react'
import { DayPicker, type DateRange } from 'react-day-picker'
import { ru } from 'react-day-picker/locale'
import 'react-day-picker/style.css'
import { cn } from '@/shared/lib/cn'
import {
  formatDateRange,
  parseLocalDateKey,
  toLocalDateKey,
} from '@/shared/lib/date'
import { inputClass } from './Field'

type DateRangeFieldProps = {
  fromName?: string
  toName?: string
  defaultFrom?: string
  defaultTo?: string
  label?: string
}

export function DateRangeField({
  fromName = 'from',
  toName = 'to',
  defaultFrom,
  defaultTo,
  label = 'Период',
}: DateRangeFieldProps) {
  const [range, setRange] = useState<DateRange | undefined>(() =>
    defaultFrom
      ? {
          from: parseLocalDateKey(defaultFrom),
          to: parseLocalDateKey(defaultTo),
        }
      : undefined
  )
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const handleSelect = (next?: DateRange) => {
    setRange(next)
    if (next?.from && next.to) setOpen(false)
  }

  const rangeLabel = formatDateRange(range)

  return (
    <div ref={rootRef} className="relative">
      <input
        type="hidden"
        name={fromName}
        value={toLocalDateKey(range?.from)}
      />
      <input type="hidden" name={toName} value={toLocalDateKey(range?.to)} />

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={`${label}: ${rangeLabel}`}
        className={cn(inputClass, 'text-left', !range?.from && 'text-muted')}
      >
        {rangeLabel}
      </button>

      {open && (
        <div className="border-line bg-surface rounded-card absolute top-full left-0 z-10 mt-2 border p-4 shadow-md">
          <DayPicker
            mode="range"
            locale={ru}
            selected={range}
            onSelect={handleSelect}
            resetOnSelect
            disabled={{ before: new Date() }}
          />
          {range?.from && (
            <button
              type="button"
              onClick={() => setRange(undefined)}
              className="text-primary mt-2 text-sm font-medium"
            >
              Очистить
            </button>
          )}
        </div>
      )}
    </div>
  )
}
