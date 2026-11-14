import { useState } from 'react'
import { getBrowserTimeZone } from '../utils/datetime'
import { clearStoredTimeZone, getStoredTimeZone, storeTimeZone } from '../utils/timeZones'

/**
 * Time zone used to display the moment of the query.
 * - By default, the browser's zone.
 * - A zone picked from the list is saved in localStorage.
 * - Picking the browser's own zone clears the saved choice, so the app goes
 *   back to following the browser (useful when travelling).
 */
export function useTimeZone() {
  const [browserTimeZone] = useState(getBrowserTimeZone)
  const [timeZone, setTimeZone] = useState(() => getStoredTimeZone() ?? browserTimeZone)

  const changeTimeZone = (next: string) => {
    if (next === browserTimeZone) {
      clearStoredTimeZone()
    } else {
      storeTimeZone(next)
    }
    setTimeZone(next)
  }

  return { timeZone, browserTimeZone, changeTimeZone }
}
