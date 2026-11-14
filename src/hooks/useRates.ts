import { useEffect, useEffectEvent, useState } from 'react'
import { fetchLatestRate, fetchRateHistory, RatesError } from '../services/rates'
import type { AsyncState, CurrencyCode, IsoDate, LatestRate, RatePoint } from '../types/rates'

/** Latest rate for a pair. Refetches whenever base or quote change. */
export function useLatestRate(base: CurrencyCode, quote: CurrencyCode) {
  return useFetch<LatestRate>(`latest:${base}:${quote}`, (signal) =>
    fetchLatestRate(base, quote, signal),
  )
}

/** Business-day rates between two dates. Refetches when any input changes. */
export function useRateHistory(base: CurrencyCode, quote: CurrencyCode, from: IsoDate, to: IsoDate) {
  return useFetch<RatePoint[]>(`history:${base}:${quote}:${from}:${to}`, (signal) =>
    fetchRateHistory(base, quote, from, to, signal),
  )
}

type FetchResult<T> = {
  state: AsyncState<T>
  /** Repeats the request (for a "Try again" button). */
  retry: () => void
}

/**
 * Runs `load` whenever `key` changes and reports loading / error / success.
 * - `key` must describe everything `load` depends on (currencies, dates).
 * - If the inputs change before the answer arrives, the old request is
 *   cancelled (AbortController), so a slow old answer can never overwrite
 *   a newer one.
 */
function useFetch<T>(key: string, load: (signal: AbortSignal) => Promise<T>): FetchResult<T> {
  const [attempt, setAttempt] = useState(0)
  // Each result remembers which request it belongs to.
  const [result, setResult] = useState<{ key: string; state: AsyncState<T> } | null>(null)
  // Last successful data, whatever request it came from (wrapped in an object
  // so that "no data yet" is clearly `null`).
  const [lastData, setLastData] = useState<{ data: T } | null>(null)
  const requestKey = `${key}#${attempt}`

  // `load` is a new function on every render. useEffectEvent lets the effect
  // call the latest one without listing it as a dependency: the effect only
  // re-runs when `requestKey` changes, and that key describes all its inputs.
  const runLoad = useEffectEvent((signal: AbortSignal) => load(signal))

  useEffect(() => {
    const controller = new AbortController()
    runLoad(controller.signal).then(
      (data) => {
        setResult({ key: requestKey, state: { status: 'success', data } })
        setLastData({ data })
      },
      (error: unknown) => {
        if (controller.signal.aborted) return
        setResult({ key: requestKey, state: { status: 'error', message: toMessage(error) } })
      },
    )
    return () => controller.abort()
  }, [requestKey])

  // While the answer for the current key has not arrived, we are loading
  // (and offer the previous data, if any, to keep on screen).
  const state: AsyncState<T> =
    result?.key === requestKey ? result.state : { status: 'loading', previous: lastData?.data }
  return { state, retry: () => setAttempt((n) => n + 1) }
}

function toMessage(error: unknown): string {
  return error instanceof RatesError
    ? error.message
    : 'Something went wrong while loading exchange rates. Try again.'
}
