import CurrencySelector from './CurrencySelector'
import LazyRateChart from './LazyRateChart'
import PeriodPicker from './PeriodPicker'
import RateChange from './RateChange'
import RateStats from './RateStats'
import RetryButton from './RetryButton'
import { getCurrency } from '../data/currencies'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { useLatestRate, useRateHistory } from '../hooks/useRates'
import type { AsyncState, CurrencyCode, IsoDate, LatestRate } from '../types/rates'
import { daysBetween, type Period } from '../utils/datetime'
import { formatAmount, formatIsoDate } from '../utils/format'

type TargetCurrencyPanelProps = {
  base: CurrencyCode
  quote: CurrencyCode
  onQuoteChange: (code: CurrencyCode) => void
  /** Amount typed in the "Base Currency" panel. */
  amount: number
  /** Period of the chart, the change and the statistics (both days included). */
  period: Period
  /** Latest date the calendars allow. */
  today: IsoDate
  onPeriodChange: (period: Period) => void
}

/**
 * "To" panel of the wireframe: the currency we convert to and the result.
 * The tab with the code ("USD") and the lavender area anticipate several
 * target currencies, one per tab (after the MVP); for now there is one.
 * Below the result: the change over the period, its chart, the calendars
 * that set the period, and the statistics.
 */
function TargetCurrencyPanel({
  base,
  quote,
  onQuoteChange,
  amount,
  period,
  today,
  onPeriodChange,
}: TargetCurrencyPanelProps) {
  const { from, to } = period
  // Hooks go before any early `return`: React needs the same hooks on every render.
  const latest = useLatestRate(base, quote)
  // One request for the period, shared by the change box and the chart.
  const history = useRateHistory(base, quote, from, to)
  // A lost connection usually breaks both requests: any "Try again" button
  // repeats every request that failed, so one click is enough.
  const retryFailed = () => {
    if (latest.state.status === 'error') latest.retry()
    if (history.state.status === 'error') history.retry()
  }
  const currency = getCurrency(quote)
  if (!currency) return null

  return (
    // `relative`: the < > arrows sit on this panel's edges, like in "Base Currency".
    <fieldset className="relative min-w-0 rounded-lg border-2 border-neutral-900 bg-white px-3 pt-1 pb-3 text-neutral-900 dark:border-neutral-500 dark:bg-neutral-900 dark:text-neutral-100">
      <legend className="ml-4 rounded-md border-2 border-neutral-900 bg-white px-2 text-sm font-semibold dark:border-neutral-500 dark:bg-neutral-900">
        To
      </legend>

      {/* Tab. `relative` paints it above the lavender area, and -mb-0.5 lets it
          cover that area's top border, so tab and area look like one piece. */}
      <div className="relative mt-2 -mb-0.5 ml-4 w-fit rounded-t-md border-2 border-b-0 border-neutral-900 bg-indigo-100 px-4 py-0.5 text-sm font-semibold tabular-nums sm:ml-6 dark:border-neutral-500 dark:bg-indigo-950">
        {currency.code}
      </div>

      {/* Lavender area. Its padding lines its content up with the "Base Currency"
          column: 12px (panel) + 2px (border) + 10px = 24px on phones, and
          12 + 2 + 18 = 32px on wider screens. */}
      <div className="flex flex-col gap-4 rounded-md border-2 border-neutral-900 bg-indigo-100 px-2.5 py-4 sm:px-4.5 dark:border-neutral-500 dark:bg-indigo-950">
        <CurrencySelector value={quote} onChange={onQuoteChange} role="target" />

        {/* Phones: result, then the change below it. Wider screens: side by
            side, as in the wireframe (the change gets about a third). */}
        <div className="grid gap-3 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] sm:items-start sm:gap-4">
          <ConversionResult state={latest.state} onRetry={retryFailed} amount={amount} quote={quote} />
          <RateChange state={history.state} days={daysBetween(from, to)} />
        </div>

        <LazyRateChart state={history.state} onRetry={retryFailed} />
        {/* Calendars right under the chart's two ends (-mt-2 pulls them closer). */}
        <div className="-mt-2">
          <PeriodPicker period={period} today={today} onChange={onPeriodChange} />
        </div>

        <RateStats state={history.state} />
      </div>
    </fieldset>
  )
}

type ConversionResultProps = {
  state: AsyncState<LatestRate>
  onRetry: () => void
  amount: number
  /** Chosen target currency, shown while there is no rate yet. */
  quote: CurrencyCode
}

/**
 * "= 0.7049 USD", and below it the unit rate and the date it was published.
 * The box is always drawn (with "—" while there is no rate), so the panel
 * keeps its size whether the rate is loading, has failed or has arrived.
 * While a new pair loads, the previous result stays on screen, dimmed.
 */
function ConversionResult({ state, onRetry, amount, quote }: ConversionResultProps) {
  const isLoading = state.status === 'loading'
  const rate =
    state.status === 'success' ? state.data : isLoading ? state.previous : undefined
  // What screen readers hear, once typing pauses: "250.0000 CAD = 174.9400 USD".
  const announcement = useDebouncedValue(
    state.status === 'success'
      ? `${formatAmount(amount)} ${state.data.base} = ${formatAmount(amount * state.data.rate)} ${state.data.quote}`
      : '',
    700,
  )

  return (
    <div
      aria-busy={isLoading}
      className={`transition-opacity motion-reduce:transition-none ${isLoading && rate ? 'opacity-40' : ''}`}
    >
      {/* Codes come from the rate itself, so a dimmed old result still reads
          correctly. Not a live region: the announcement below speaks for it. */}
      <div className="flex items-baseline gap-4 rounded-t-md border-b-2 border-neutral-900 bg-neutral-100 px-4 py-2 dark:border-neutral-300 dark:bg-neutral-800">
        <span className="text-xl">=</span>
        {/* A huge result wraps instead of overflowing on phones: preferably
            after a comma (<wbr>), and anywhere as a last resort. */}
        <span className="min-w-0 flex-1 text-2xl text-blue-700 tabular-nums wrap-anywhere dark:text-blue-300">
          {rate ? <BreakAfterCommas text={formatAmount(amount * rate.rate)} /> : '—'}
        </span>
        <span className="text-xl text-neutral-700 dark:text-neutral-300">{rate?.quote ?? quote}</span>
      </div>
      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>

      {state.status === 'error' ? (
        <div
          role="alert"
          className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-red-700 dark:text-red-400"
        >
          <p>{state.message}</p>
          <RetryButton onClick={onRetry} />
        </div>
      ) : (
        <p className="mt-1 min-h-5 text-sm text-neutral-700 dark:text-neutral-300">
          {rate ? (
            <>
              {/* nowrap pieces: on phones the line breaks at " · ", never
                  inside the rate or the date ("November / 17, 2026"). */}
              <span className="whitespace-nowrap tabular-nums">
                1 {rate.base} = {formatAmount(rate.rate)} {rate.quote}
              </span>
              {' · '}
              {/* The rate date can be earlier than today: weekends and holidays have no rate. */}
              <span className="whitespace-nowrap">Rate of {formatIsoDate(rate.date)}</span>
            </>
          ) : (
            'Loading rate…'
          )}
        </p>
      )}
    </div>
  )
}

/** "12,784,999.0000" -> "12,<wbr>784,<wbr>999.0000": lines may break after each comma. */
function BreakAfterCommas({ text }: { text: string }) {
  const groups = text.split(',')
  return groups.map((group, index) => (
    // The groups never change order, so the index is a safe key.
    <span key={index}>
      {group}
      {index < groups.length - 1 && (
        <>
          ,<wbr />
        </>
      )}
    </span>
  ))
}

export default TargetCurrencyPanel
