export function maskDateTime(input: string) {
  const digits = input.replace(/\D/g, '').slice(0, 12)
  let result = digits.slice(0, 2)
  if (digits.length > 2) result += `.${digits.slice(2, 4)}`
  if (digits.length > 4) result += `.${digits.slice(4, 8)}`
  if (digits.length > 8) result += `, ${digits.slice(8, 10)}`
  if (digits.length > 10) result += `:${digits.slice(10, 12)}`
  return result
}

export function parseDateTimeText(text: string) {
  const match = /^(\d{2})\.(\d{2})\.(\d{4}), (\d{2}):(\d{2})$/.exec(text)
  if (!match) return null

  const [, day, month, year, hours, minutes] = match
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)))
  const exists =
    date.getUTCFullYear() === Number(year) &&
    date.getUTCMonth() === Number(month) - 1 &&
    date.getUTCDate() === Number(day)

  if (!exists || Number(hours) > 23 || Number(minutes) > 59) return null
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

export function formatDateTimeText(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value)
  return match
    ? `${match[3]}.${match[2]}.${match[1]}, ${match[4]}:${match[5]}`
    : ''
}
