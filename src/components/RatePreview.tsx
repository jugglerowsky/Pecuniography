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
      <p className="text-sm text-neutral-600 dark:text-neutral-400">
        {baseName} → {quoteName}
      </p>

      <Status state={latest.state} onRetry={latest.retry}>
        {(rate) => (
          <>
            <p className="text-3xl font-semibold tabular-nums">
              {formatAmount(amount)} {base} = {formatAmount(amount * rate.rate)} {quote}
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Rate date: {formatIsoDate(rate.date)}
            </p>
          </>
        )}
      </Status>

      <Status state={history.state} onRetry={history.retry}>
        {(points) => (
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
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

/** Shows "Loading…", an error with a retry button, or the data. */
function Status<T>({ state, onRetry, children }: StatusProps<T>) {
  if (state.status === 'loading') {
    return <p className="text-sm text-neutral-500 dark:text-neutral-400">Loading…</p>
  }
  if (state.status === 'error') {
    return (
      <div role="alert" className="flex flex-col items-center gap-2 text-sm text-red-700 dark:text-red-400">
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
  return <>{children(state.data)}</>
}

export default RatePreview
