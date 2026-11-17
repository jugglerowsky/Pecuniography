import { ChevronIcon } from './icons'
import type { AsyncState, RatePoint } from '../types/rates'
import { formatPercentChange } from '../utils/format'

type RateChangeProps = {
  /** Rates of the period, oldest first. */
  state: AsyncState<RatePoint[]>
  /** Length of the period in calendar days ("After 30 days"). */
  days: number
}

/**
 * "After 30 days: ▲ +0.56%": how much the rate moved from the first to the
 * last business day of the period. Green going up, red going down, and the
 * arrow plus a hidden "Up"/"Down" so the meaning never depends on color alone.
 * Shows "—" while there is nothing to compare (loading, error, < 2 rates).
 */
function RateChange({ state, days }: RateChangeProps) {
  const isLoading = state.status === 'loading'
  const points = state.status === 'success' ? state.data : isLoading ? state.previous : undefined
  const change =
    points && points.length >= 2 ? points[points.length - 1].rate / points[0].rate - 1 : undefined
  const text = change === undefined ? '—' : formatPercentChange(change)
  // Compare the rounded text, so "+0.00%" never shows up as a green arrow.
  const direction =
    change === undefined || text === formatPercentChange(0) ? 'flat' : change > 0 ? 'up' : 'down'

  return (
    <div
      aria-busy={isLoading}
      className={`transition-opacity motion-reduce:transition-none ${isLoading && points ? 'opacity-40' : ''}`}
    >
      {/* Phones: one line, label left and value right. Wider screens: two
          centered lines, as in the wireframe. */}
      <div className="flex items-center justify-between gap-3 rounded-t-md border-b-2 border-neutral-900 bg-neutral-100 px-4 py-2 sm:flex-col sm:justify-center sm:gap-0 sm:py-0.5 dark:border-neutral-300 dark:bg-neutral-800">
        <p className="text-sm leading-5 text-neutral-700 sm:text-xs sm:leading-4 dark:text-neutral-300">After {days} days:</p>
        <p
          className={`flex items-center gap-2 text-xl leading-7 font-semibold tabular-nums ${DIRECTION_STYLES[direction].text}`}
        >
          {direction !== 'flat' && (
            <span
              aria-hidden="true"
              className={`flex size-5 items-center justify-center rounded-full text-white ${DIRECTION_STYLES[direction].badge}`}
            >
              <ChevronIcon direction={direction} className="size-3.5" />
            </span>
          )}
          <span>
            {direction !== 'flat' && <span className="sr-only">{direction === 'up' ? 'Up ' : 'Down '}</span>}
            {text}
          </span>
        </p>
      </div>
    </div>
  )
}

const DIRECTION_STYLES = {
  up: { text: 'text-green-700 dark:text-green-400', badge: 'bg-green-600' },
  down: { text: 'text-red-700 dark:text-red-400', badge: 'bg-red-600' },
  flat: { text: 'text-neutral-700 dark:text-neutral-300', badge: '' },
}

export default RateChange
