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

/** Readable city from an IANA name: "America/Mexico_City" -> "Mexico City". */
export function getCityName(timeZone: string): string {
  const lastSegment = timeZone.split('/').pop() ?? timeZone
  return lastSegment.replaceAll('_', ' ')
}
