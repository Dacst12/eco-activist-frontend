import { CITY_TIMEZONE, LOCALE } from '@/shared/config/locale'

const dayFormat = new Intl.DateTimeFormat(LOCALE, {
  day: 'numeric',
  month: 'long',
  timeZone: CITY_TIMEZONE,
})

const timeFormat = new Intl.DateTimeFormat(LOCALE, {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: CITY_TIMEZONE,
})

export const formatEventDate = (startsAt: string, endsAt: string) => {
  const start = new Date(startsAt)
  const end = new Date(endsAt)
  return `${dayFormat.format(start)} · ${timeFormat.format(start)}–${timeFormat.format(end)}`
}

const dateKeyFormat = new Intl.DateTimeFormat('en-CA', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  timeZone: CITY_TIMEZONE,
})

export const toCityDateKey = (iso: string) =>
  dateKeyFormat.format(new Date(iso))

const pad = (n: number) => String(n).padStart(2, '0')

export const toLocalDateKey = (date?: Date) =>
  date
    ? `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
    : ''

export const parseLocalDateKey = (key?: string) => {
  if (!key) return undefined
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

const dayMonthFormat = new Intl.DateTimeFormat(LOCALE, {
  day: 'numeric',
  month: 'long',
})

export const formatDateRange = (range?: { from?: Date; to?: Date }) => {
  if (!range?.from) return 'Любые даты'
  const from = dayMonthFormat.format(range.from)
  if (!range.to) return `с ${from}`
  if (toLocalDateKey(range.from) === toLocalDateKey(range.to)) return from
  return `${from} – ${dayMonthFormat.format(range.to)}`
}

export const formatDateTime = (iso: string) => {
  const date = new Date(iso)
  return `${dayFormat.format(date)}, ${timeFormat.format(date)}`
}

export const CITY_DATE_TIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/

function getCityOffset(timestamp: number) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone: CITY_TIMEZONE,
      hourCycle: 'h23',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
      .formatToParts(timestamp)
      .map(({ type, value }) => [type, value])
  )
  const asUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second)
  )
  return asUtc - timestamp
}

export function fromCityDateTime(value: string) {
  const asUtc = Date.parse(`${value}:00Z`)
  return new Date(asUtc - getCityOffset(asUtc)).toISOString()
}

export function toCityDateTime(iso: string) {
  const timestamp = Date.parse(iso)
  return new Date(timestamp + getCityOffset(timestamp))
    .toISOString()
    .slice(0, 16)
}
