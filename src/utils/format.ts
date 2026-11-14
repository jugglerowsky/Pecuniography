import type { IsoDate } from '../types/rates'

const LOCALE = 'en-US'

const amountFormat = new Intl.NumberFormat(LOCALE, {
  minimumFractionDigits: 4,
  maximumFractionDigits: 4,
})

/** Every amount and rate in the app uses 4 decimals: 0.70136 -> "0.7014". */
export function formatAmount(value: number): string {
  return amountFormat.format(value)
}

// API dates ("2026-11-13") have no time zone. We read and print them as UTC
// so the day never shifts, whatever the user's zone is.
const isoDateFormat = new Intl.DateTimeFormat(LOCALE, {
  timeZone: 'UTC',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

/** "2026-11-13" -> "November 13, 2026" */
export function formatIsoDate(date: IsoDate): string {
  return isoDateFormat.format(new Date(`${date}T00:00:00Z`))
}
