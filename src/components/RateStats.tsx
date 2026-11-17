import type { AsyncState, IsoDate, RateHistory, RatePoint } from '../types/rates'
import { formatAmount, formatMediumIsoDate } from '../utils/format'

type RateStatsProps = {
  /** Rates of the period, oldest first. */
  state: AsyncState<RateHistory>
}

type Stat = { label: string; rate?: number; date?: IsoDate }

/**
 * Initial, minimum, maximum and average rate of the period, as a list like
 * the wireframe's. A <dl> (description list) pairs each label with its value
 * for screen readers.
 * - Wider screens: one row per statistic, in columns: label | value | date.
 * - Phones: the date moves to a second, smaller line under the value.
 * The four rows are always there ("—" while there is no data), so the panel
 * keeps its size; while new data loads the previous numbers stay, dimmed.
 */
function RateStats({ state }: RateStatsProps) {
  const isLoading = state.status === 'loading'
  const history = state.status === 'success' ? state.data : isLoading ? state.previous : undefined
  const stats = getStats(history?.points ?? [])

  return (
    <dl
      aria-label="Period statistics"
      aria-busy={isLoading}
      className={`grid w-full grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2 rounded-md bg-neutral-100 px-4 py-3 transition-opacity motion-reduce:transition-none sm:mx-auto sm:w-fit sm:grid-cols-[auto_auto_auto] sm:gap-y-1 dark:bg-neutral-800 ${
        isLoading && history ? 'opacity-40' : ''
      }`}
    >
      {stats.map((stat) => (
        // `subgrid`: each row uses the columns of the whole list, so labels,
        // values and dates line up from row to row.
        <div key={stat.label} className="col-span-2 grid grid-cols-subgrid items-baseline sm:col-span-3">
          <dt className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
            <span aria-hidden="true" className="size-2 shrink-0 self-center rounded-full bg-indigo-900 dark:bg-indigo-300" />
            {stat.label}:
          </dt>
          <dd className="tabular-nums">
            {stat.rate === undefined ? (
              '—'
            ) : (
              <>
                <span className="font-semibold">{formatAmount(stat.rate)}</span> {history?.quote}
              </>
            )}
          </dd>
          {stat.date && (
            <dd className="col-start-2 -mt-1.5 text-sm text-neutral-600 sm:col-start-auto sm:mt-0 sm:text-base dark:text-neutral-400">
              <span aria-hidden="true" className="hidden sm:inline">
                –{' '}
              </span>
              {formatMediumIsoDate(stat.date)}
            </dd>
          )}
        </div>
      ))}
    </dl>
  )
}

/**
 * Walks the rates once. Ties keep the most recent date: the list is oldest
 * first, so `<=` / `>=` let a later equal rate replace an earlier one.
 */
function getStats(points: RatePoint[]): Stat[] {
  if (points.length === 0) {
    return [
      { label: 'Initial Value' },
      { label: 'Min. Value' },
      { label: 'Max. Value' },
      { label: 'Average' },
    ]
  }

  let min = points[0]
  let max = points[0]
  let sum = 0
  for (const point of points) {
    if (point.rate <= min.rate) min = point
    if (point.rate >= max.rate) max = point
    sum += point.rate
  }

  return [
    { label: 'Initial Value', rate: points[0].rate, date: points[0].date },
    { label: 'Min. Value', rate: min.rate, date: min.date },
    { label: 'Max. Value', rate: max.rate, date: max.date },
    // The average of the published (business-day) rates.
    { label: 'Average', rate: sum / points.length },
  ]
}

export default RateStats
