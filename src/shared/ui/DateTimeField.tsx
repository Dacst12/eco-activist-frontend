'use client'

import { useId, useRef, useState, type Ref } from 'react'
import { DayPicker } from 'react-day-picker'
import { ru } from 'react-day-picker/locale'
import 'react-day-picker/style.css'
import { CITY_TIMEZONE_LABEL } from '@/shared/config/locale'
import { cn } from '@/shared/lib/cn'
import {
  CITY_DATE_TIME,
  parseLocalDateKey,
  toLocalDateKey,
} from '@/shared/lib/date'
import {
  formatDateTimeText,
  maskDateTime,
  parseDateTimeText,
} from '@/shared/lib/dateTimeText'
import { useDismiss } from '@/shared/lib/useDismiss'
import { inputClass } from './Field'
import { FieldFrame, fieldControlProps } from './FieldFrame'
import { Select } from './Select'

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
const MINUTES = Array.from({ length: 12 }, (_, i) =>
  String(i * 5).padStart(2, '0')
)
const DEFAULT_TIME = '10:00'

type DateTimeFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  name?: string
  ref?: Ref<HTMLInputElement>
  error?: string
  hint?: string
  id?: string
  className?: string
  disabled?: boolean
}

export function DateTimeField({
  label,
  value,
  onChange,
  onBlur,
  name,
  ref,
  error,
  hint,
  id,
  className,
  disabled,
}: DateTimeFieldProps) {
  const autoId = useId()
  const inputId = id ?? autoId
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  useDismiss(rootRef, open, () => setOpen(false))

  const complete = CITY_DATE_TIME.test(value)
  const text = complete ? formatDateTimeText(value) : value
  const [dateKey, time] = complete
    ? value.split('T')
    : [undefined, DEFAULT_TIME]
  const [hours, minutes] = time.split(':')
  const selectedDay = parseLocalDateKey(dateKey)
  const minuteOptions = MINUTES.includes(minutes)
    ? MINUTES
    : [...MINUTES, minutes].sort()

  const handleTextChange = (raw: string) => {
    const masked = maskDateTime(raw)
    onChange(parseDateTimeText(masked) ?? masked)
  }

  const setTime = (nextHours: string, nextMinutes: string) => {
    if (dateKey) onChange(`${dateKey}T${nextHours}:${nextMinutes}`)
  }

  return (
    <FieldFrame
      label={label}
      inputId={inputId}
      error={error}
      hint={hint}
      className={className}
    >
      <div ref={rootRef} className="relative">
        <input
          {...fieldControlProps(inputId, error, hint)}
          ref={ref}
          name={name}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          placeholder="31.10.2026, 10:00"
          value={text}
          onChange={(event) => handleTextChange(event.target.value)}
          onBlur={onBlur}
          disabled={disabled}
          className={cn(
            inputClass,
            'pr-28',
            error && 'border-danger focus:ring-danger'
          )}
        />

        <div className="absolute inset-y-0 right-2 flex items-center gap-2">
          <span className="text-muted text-sm">{CITY_TIMEZONE_LABEL}</span>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            disabled={disabled}
            aria-expanded={open}
            aria-label="Выбрать в календаре"
            className="text-muted hover:text-primary rounded-control flex size-9 items-center justify-center"
          >
            <svg aria-hidden viewBox="0 0 20 20" fill="none" className="size-5">
              <rect
                x="3"
                y="4.5"
                width="14"
                height="12.5"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M3 8.5h14M7 2.5v4M13 2.5v4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {open && (
          <div className="border-line bg-surface rounded-card absolute top-full right-0 z-10 mt-2 border p-4 shadow-md">
            <DayPicker
              mode="single"
              required
              locale={ru}
              selected={selectedDay}
              defaultMonth={selectedDay}
              onSelect={(day) => onChange(`${toLocalDateKey(day)}T${time}`)}
              disabled={{ before: new Date() }}
            />

            <div className="border-line mt-2 flex items-center gap-2 border-t pt-4">
              <span className="text-muted text-sm">Время</span>
              <Select
                aria-label="Часы"
                value={hours}
                onChange={(event) => setTime(event.target.value, minutes)}
                disabled={!dateKey}
                className="w-20"
              >
                {HOURS.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </Select>
              <span aria-hidden>:</span>
              <Select
                aria-label="Минуты"
                value={minutes}
                onChange={(event) => setTime(hours, event.target.value)}
                disabled={!dateKey}
                className="w-20"
              >
                {minuteOptions.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </Select>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-primary ml-auto text-sm font-medium"
              >
                Готово
              </button>
            </div>
            {!dateKey && (
              <p className="text-muted mt-2 text-sm">Сначала выберите день</p>
            )}
          </div>
        )}
      </div>
    </FieldFrame>
  )
}
