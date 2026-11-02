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
