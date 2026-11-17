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

const percentFormat = new Intl.NumberFormat(LOCALE, {
  style: 'percent',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  // "+0.56%" and "-0.12%", but plain "0.00%" when nothing changed.
  signDisplay: 'exceptZero',
})

/** Change as a fraction -> signed percentage: 0.0056 -> "+0.56%". */
export function formatPercentChange(fraction: number): string {
  return percentFormat.format(fraction)
}

const shortDateFormat = new Intl.DateTimeFormat(LOCALE, {
  timeZone: 'UTC',
  month: 'short',
  day: 'numeric',
})

/** Chart axis labels: "2026-10-18" -> "Oct 18". */
export function formatShortIsoDate(date: IsoDate): string {
  return shortDateFormat.format(isoDateToTime(date))
}

const mediumDateFormat = new Intl.DateTimeFormat(LOCALE, {
  timeZone: 'UTC',
  year: 'numeric',
  month: 'short',
  day: 'numeric',
})

/** Statistics: "2026-10-19" -> "Oct 19, 2026". */
export function formatMediumIsoDate(date: IsoDate): string {
  return mediumDateFormat.format(isoDateToTime(date))
}

const monthYearFormat = new Intl.DateTimeFormat(LOCALE, { timeZone: 'UTC', month: 'short', year: 'numeric' })
const yearFormat = new Intl.DateTimeFormat(LOCALE, { timeZone: 'UTC', year: 'numeric' })

/** Long chart periods: "2026-10-01" -> "Oct 2026". */
export function formatMonthYear(date: IsoDate): string {
  return monthYearFormat.format(isoDateToTime(date))
}

/** Very long chart periods: "2026-01-01" -> "2026". */
export function formatYear(date: IsoDate): string {
  return yearFormat.format(isoDateToTime(date))
}

const axisNumberFormat = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 4 })

/** Chart value axis: as few decimals as the tick needs (0.72, 0.715, 12,800). */
export function formatAxisNumber(value: number): string {
  return axisNumberFormat.format(value)
}

/** "2026-11-13" -> milliseconds at 00:00 UTC that day (for the chart's time axis). */
export function isoDateToTime(date: IsoDate): number {
  return Date.parse(`${date}T00:00:00Z`)
}

/** Milliseconds from isoDateToTime() -> "2026-11-13". */
export function timeToIsoDate(time: number): IsoDate {
  return new Date(time).toISOString().slice(0, 10)
}
