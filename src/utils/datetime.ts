// Date and time helpers. Every function receives an IANA time zone
// (e.g. "America/Mexico_City") so the same moment can be shown in any zone.

const LOCALE = 'en-US'

/**
 * The time zone configured in the user's browser, e.g. "America/Vancouver".
 * Falls back to UTC if the environment does not report one.
 */
export function getBrowserTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone ?? 'UTC'
}

/** "February 29, 2025" */
export function formatLongDate(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat(LOCALE, {
    timeZone,
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

/** "16:30" (24-hour clock) */
export function formatTime(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat(LOCALE, {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(date)
}

/**
 * UTC offset of a time zone at a given moment: "UTC-6", "UTC+5:30", "UTC+0".
 * The moment matters because of daylight saving time.
 */
export function formatUtcOffset(date: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat(LOCALE, {
    timeZone,
    timeZoneName: 'shortOffset',
  }).formatToParts(date)
  // Intl returns "GMT-6", "GMT+5:30" or just "GMT" for zero offset.
  const offset = parts.find((part) => part.type === 'timeZoneName')?.value ?? 'GMT'
  const sign = offset.replace('GMT', '')
  return `UTC${sign === '' ? '+0' : sign}`
}

/** UTC offset in minutes at a given moment: "UTC-6" -> -360, "UTC+5:30" -> 330. */
export function getUtcOffsetMinutes(date: Date, timeZone: string): number {
  const match = /UTC([+-])(\d+)(?::(\d+))?/.exec(formatUtcOffset(date, timeZone))
  if (!match) return 0
  const [, sign, hours, minutes = '0'] = match
  const total = Number(hours) * 60 + Number(minutes)
  return sign === '-' ? -total : total
}

/** True if the browser knows this IANA time zone (e.g. a value read from storage). */
export function isValidTimeZone(timeZone: string): boolean {
  try {
    new Intl.DateTimeFormat(LOCALE, { timeZone })
    return true
  } catch {
    return false
  }
}

/** Calendar date of a moment in a zone, as "YYYY-MM-DD" (the API's format). */
export function toIsoDate(date: Date, timeZone: string): string {
  // The en-CA locale writes dates as YYYY-MM-DD.
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

/** "2026-11-13" plus `days` (can be negative) -> "YYYY-MM-DD". */
export function addDays(isoDate: string, days: number): string {
  const date = new Date(`${isoDate}T00:00:00Z`)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

/** Whole days from one "YYYY-MM-DD" to another: ("2026-10-18", "2026-11-17") -> 30. */
export function daysBetween(from: string, to: string): number {
  const DAY = 24 * 60 * 60 * 1000
  return Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / DAY)
}

/** Default chart period: the last 30 days up to today (in the shown zone). */
export function getDefaultPeriod(queriedAt: Date, timeZone: string) {
  const to = toIsoDate(queriedAt, timeZone)
  return { from: addDays(to, -30), to }
}

/** Readable city from an IANA name: "America/Mexico_City" -> "Mexico City". */
export function getCityName(timeZone: string): string {
  const lastSegment = timeZone.split('/').pop() ?? timeZone
  return lastSegment.replaceAll('_', ' ')
}
