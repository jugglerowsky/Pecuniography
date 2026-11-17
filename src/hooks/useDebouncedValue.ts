import { useEffect, useState } from 'react'

/**
 * `value`, but only after it has stopped changing for `delay` ms.
 * Used so screen readers announce a result once, when the user pauses,
 * instead of after every keystroke.
 */
export function useDebouncedValue<T>(value: T, delay: number): T {
  const [settled, setSettled] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setSettled(value), delay)
    // A new value before the delay ends cancels the pending one.
    return () => clearTimeout(timer)
  }, [value, delay])

  return settled
}
