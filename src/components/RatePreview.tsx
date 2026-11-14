import type { ReactNode } from 'react'
import { getCurrency } from '../data/currencies'
import { useLatestRate, useRateHistory } from '../hooks/useRates'
import type { AsyncState, CurrencyCode, IsoDate } from '../types/rates'
import { formatAmount, formatIsoDate } from '../utils/format'

type RatePreviewProps = {
  base: CurrencyCode
  quote: CurrencyCode
  amount: number
  from: IsoDate
  to: IsoDate
}

/**
 * TEMPORARY (step 4): a plain readout that proves the data layer works.
 * Steps 5–9 replace it with the "Base Currency" and "To" panels.
 */
function RatePreview({ base, quote, amount, from, to }: RatePreviewProps) {
  const latest = useLatestRate(base, quote)
  const history = useRateHistory(base, quote, from, to)
  const baseName = getCurrency(base)?.name ?? base
  const quoteName = getCurrency(quote)?.name ?? quote

  return (
    <section aria-live="polite" className="flex flex-col items-center gap-3 text-center">
      <p className="text-sm text-on-backdrop-muted">
        {baseName} → {quoteName}
      </p>

      <Status state={latest.state} onRetry={latest.retry}>
        {(rate) => (
          <>
            <p className="text-3xl font-semibold tabular-nums">
              {/* Codes from the data itself: while the next pair loads, the
                  dimmed previous result still reads correctly. */}
              {formatAmount(amount)} {rate.base} = {formatAmount(amount * rate.rate)} {rate.quote}
            </p>
            <p className="text-sm text-on-backdrop-muted">
              Rate date: {formatIsoDate(rate.date)}
            </p>
          </>
        )}
      </Status>

      <Status state={history.state} onRetry={history.retry}>
        {(points) => (
          <p className="text-sm text-on-backdrop-muted">
            {points.length} business days with data from {formatIsoDate(from)} to{' '}
            {formatIsoDate(to)}
          </p>
        )}
      </Status>
    </section>
  )
}

type StatusProps<T> = {
  state: AsyncState<T>
  onRetry: () => void
  children: (data: T) => ReactNode
}

/**
 * Shows the data, an error with a retry button, or "Loading…".
 * While new data loads, the previous data stays on screen, dimmed, so the
 * page does not shrink and grow (aria-busy tells screen readers it is updating).
 * The data always sits in the same <div>, loading or not, so its size is identical.
 */
function Status<T>({ state, onRetry, children }: StatusProps<T>) {
  if (state.status === 'error') {
    return (
      <div role="alert" className="flex flex-col items-center gap-2 text-sm text-on-backdrop-error">
        <p>{state.message}</p>
        <button
          type="button"
          onClick={onRetry}
          className="cursor-pointer rounded-full bg-fuchsia-600 px-3 py-1 text-white hover:bg-fuchsia-700 dark:bg-fuchsia-500 dark:hover:bg-fuchsia-400"
        >
          Try again
        </button>
      </div>
    )
  }

  const isLoading = state.status === 'loading'
  const data = isLoading ? state.previous : state.data
  // First load: nothing to show yet.
  if (data === undefined) {
    return <p className="text-sm text-on-backdrop-muted">Loading…</p>
  }

  return (
    <div
      aria-busy={isLoading}
      className={`flex flex-col items-center gap-3 transition-opacity motion-reduce:transition-none ${
        isLoading ? 'opacity-40' : ''
      }`}
    >
      {children(data)}
    </div>
  )
}

export default RatePreview
