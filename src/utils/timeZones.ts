import { TIME_ZONES } from '../data/timeZones'
import {
  formatUtcOffset,
  getCityName,
  getUtcOffsetMinutes,
  isValidTimeZone,
} from './datetime'
import { readStorage, removeStorage, writeStorage } from './storage'

/** One row of the time zone selector, ready to display. */
export type TimeZoneOption = {
  timeZone: string
  city: string
  /** "UTC-6", "UTC+5:30"... at the moment of the query. */
  offset: string
  offsetMinutes: number
}

/**
 * The selector's list, sorted by offset (west to east), then by city.
 * `extraZones` (the browser's zone and the selected one) are added if they
 * are not already in the curated list, so they can always be picked.
 */
export function getTimeZoneOptions(date: Date, extraZones: string[]): TimeZoneOption[] {
  const cityOverrides = new Map(TIME_ZONES.map((entry) => [entry.timeZone, entry.city]))
  const zones = new Set([...TIME_ZONES.map((entry) => entry.timeZone), ...extraZones])

  return [...zones]
    .map((timeZone) => ({
      timeZone,
      city: cityOverrides.get(timeZone) ?? getCityName(timeZone),
      offset: formatUtcOffset(date, timeZone),
      offsetMinutes: getUtcOffsetMinutes(date, timeZone),
    }))
    .sort((a, b) => a.offsetMinutes - b.offsetMinutes || a.city.localeCompare(b.city))
}

/** City shown in the header for a zone, using the same names as the list. */
export function getTimeZoneCity(timeZone: string): string {
  return TIME_ZONES.find((entry) => entry.timeZone === timeZone)?.city ?? getCityName(timeZone)
}

const TIME_ZONE_STORAGE_KEY = 'pecuniography-time-zone'

/** Zone the user picked, or null if they follow the browser's zone. */
export function getStoredTimeZone(): string | null {
  const value = readStorage(TIME_ZONE_STORAGE_KEY)
  return value !== null && isValidTimeZone(value) ? value : null
}

export function storeTimeZone(timeZone: string): void {
  writeStorage(TIME_ZONE_STORAGE_KEY, timeZone)
}

export function clearStoredTimeZone(): void {
  removeStorage(TIME_ZONE_STORAGE_KEY)
}
