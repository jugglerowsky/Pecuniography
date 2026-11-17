import { useId, type ReactNode } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import RetryButton from './RetryButton'
import type { AsyncState, CurrencyCode, IsoDate, RateHistory, RatePoint } from '../types/rates'
import { addDays, daysBetween } from '../utils/datetime'
import {
  formatAmount,
  formatAxisNumber,
  formatIsoDate,
  formatMonthYear,
  formatShortIsoDate,
  formatYear,
  isoDateToTime,
  timeToIsoDate,
} from '../utils/format'

type RateChartProps = {
  state: AsyncState<RateHistory>
  onRetry: () => void
}

/** One chart point: the date as a number, so the X axis can be a real time scale. */
type ChartPoint = { time: number; rate: number }

/**
 * Area chart of the rate over the period (Recharts).
 * - The X axis is a calendar: every day has its place, so weekends and
 *   holidays (no rate published) show as a longer straight segment.
 * - Colors come from the --chart-* tokens in index.css, so the chart follows
 *   the light/dark theme on its own.
 * - Hover (or arrow keys once focused) shows a crosshair and the day's rate.
 * - The same data is in a table for screen readers.
 * Every state uses the same box height, so the panel never jumps.
 * The period comes with the data: while a new period loads, the dimmed old
 * chart keeps its own axis instead of being squeezed into the new one.
 */
function RateChart({ state, onRetry }: RateChartProps) {
  const isLoading = state.status === 'loading'
  const history = state.status === 'success' ? state.data : isLoading ? state.previous : undefined

  let content: ReactNode
  if (state.status === 'error') {
    content = (
      <Message>
        <div role="alert" className="flex flex-col items-center gap-2 text-red-700 dark:text-red-400">
          <p>{state.message}</p>
          <RetryButton onClick={onRetry} />
        </div>
      </Message>
    )
  } else if (history === undefined) {
    content = <Message>Loading chart…</Message>
  } else if (history.points.length === 0) {
    content = <Message>No rates were published in this period.</Message>
  } else {
    content = <Chart points={history.points} from={history.from} to={history.to} quote={history.quote} />
  }

  return (
    <figure
      aria-busy={isLoading}
      className={`transition-opacity motion-reduce:transition-none ${isLoading && history ? 'opacity-40' : ''}`}
    >
      {history && (
        <figcaption className="sr-only">
          Exchange rate from {formatIsoDate(history.from)} to {formatIsoDate(history.to)}
        </figcaption>
      )}
      {/* Fixed height, axis labels included, in every state. */}
      <div className="h-56 rounded-md bg-white px-2 py-2 sm:h-64 dark:bg-neutral-900">{content}</div>
      {history && history.points.length > 0 && <DataTable history={history} />}
    </figure>
  )
}

type ChartProps = {
  points: RatePoint[]
  from: IsoDate
  to: IsoDate
  quote: CurrencyCode
}

function Chart({ points, from, to, quote }: ChartProps) {
  // Each chart needs its own gradient id (SVG ids are global to the page).
  const gradientId = useId()
  const data: ChartPoint[] = points.map((point) => ({ time: isoDateToTime(point.date), rate: point.rate }))
  const last = data[data.length - 1]
  const valueTicks = getValueTicks(points.map((point) => point.rate))
  const dateTicks = getDateTicks(from, to)
  const start = isoDateToTime(from)
  const end = isoDateToTime(to)

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
        <defs>
          {/* A light wash under the line, fading toward the bottom. */}
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-line)" stopOpacity={0.2} />
            <stop offset="100%" stopColor="var(--chart-line)" stopOpacity={0.02} />
          </linearGradient>
        </defs>

        {/* Horizontal hairlines only: they help read the values, not the dates. */}
        <CartesianGrid vertical={false} stroke="var(--chart-grid)" />

        <XAxis
          dataKey="time"
          type="number"
          scale="time"
          // A one-day period gets half a day of room on each side.
          domain={start === end ? [start - HALF_DAY, end + HALF_DAY] : [start, end]}
          ticks={dateTicks.ticks}
          tickFormatter={(time: number) => dateTicks.format(timeToIsoDate(time))}
          tick={{ fill: 'var(--chart-axis)', fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: 'var(--chart-grid)' }}
          tickMargin={6}
        />
        <YAxis
          dataKey="rate"
          // Zoomed in on the rates (not starting at 0), so small moves are visible.
          domain={[valueTicks[0], valueTicks[valueTicks.length - 1]]}
          ticks={valueTicks}
          tickFormatter={formatAxisNumber}
          tick={{ fill: 'var(--chart-axis)', fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          width="auto"
        />

        <Tooltip
          content={({ active, payload }) =>
            active ? <ChartTooltip point={payload?.[0]?.payload as ChartPoint | undefined} quote={quote} /> : null
          }
          cursor={{ stroke: 'var(--chart-crosshair)', strokeWidth: 1 }}
          isAnimationActive={false}
        />

        <Area
          type="linear"
          dataKey="rate"
          stroke="var(--chart-line)"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
          fill={`url(#${gradientId})`}
          dot={false}
          activeDot={{ r: 5, fill: 'var(--chart-line)', stroke: 'var(--chart-surface)', strokeWidth: 2 }}
          isAnimationActive={false}
        />

        {/* End dot on the latest rate, as in the wireframe. */}
        <ReferenceDot
          x={last.time}
          y={last.rate}
          r={4}
          fill="var(--chart-line)"
          stroke="var(--chart-surface)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

const HALF_DAY = 12 * 60 * 60 * 1000

/**
 * About five dates for the X axis and how to write them:
 * - Up to ~6 months: evenly spaced days from the first one, every day for a
 *   week, weekly for a month (Oct 18, Oct 25, …), every few weeks after that.
 * - Longer: the first day of every 1, 2, 3, 6… months ("Jan 2026", "Apr 2026"),
 *   or of every 1, 2, 5… years for periods of several years ("2024", "2025").
 */
function getDateTicks(from: IsoDate, to: IsoDate): { ticks: number[]; format: (date: IsoDate) => string } {
  const days = daysBetween(from, to)

  if (days <= 183) {
    const step = days <= 10 ? Math.max(1, Math.ceil(days / 5)) : Math.ceil(days / 5 / 7) * 7
    const ticks: number[] = []
    for (let offset = 0; offset <= days; offset += step) {
      ticks.push(isoDateToTime(addDays(from, offset)))
    }
    return { ticks, format: formatShortIsoDate }
  }

  // Count months as year * 12 + month, so steps can cross years.
  const months = days / 30.44
  const stepMonths = [1, 2, 3, 6, 12, 24, 60, 120].find((step) => months / step <= 5) ?? 120
  const [fromYear, fromMonth] = from.split('-').map(Number)
  const ticks: number[] = []
  for (let index = fromYear * 12 + fromMonth - 1; ; index++) {
    const date = `${Math.floor(index / 12)}-${String((index % 12) + 1).padStart(2, '0')}-01`
    if (date > to) break
    if (date >= from && index % stepMonths === 0) ticks.push(isoDateToTime(date))
  }
  return { ticks, format: stepMonths >= 12 ? formatYear : formatMonthYear }
}

/** Box that follows the crosshair: the day's rate and its date. */
/**
 * About five round values covering the rates: steps of 1, 2, 2.5 or 5 times
 * a power of ten (0.70, 0.705, 0.71… or 12,700, 12,750…).
 */
function getValueTicks(rates: number[]): number[] {
  let min = Math.min(...rates)
  let max = Math.max(...rates)
  if (min === max) {
    // A flat line (e.g. same currency on both sides): give it some room.
    const room = Math.abs(min) * 0.01 || 1
    min -= room
    max += room
  }
  const roughStep = (max - min) / 4
  const magnitude = 10 ** Math.floor(Math.log10(roughStep))
  const step = [1, 2, 2.5, 5, 10].map((m) => m * magnitude).find((s) => s >= roughStep) ?? 10 * magnitude
  const first = Math.floor(min / step)
  const last = Math.ceil(max / step)
  const ticks: number[] = []
  // Multiplying integers (not adding steps) avoids 0.7150000001-style values.
  for (let i = first; i <= last; i++) ticks.push(Number((i * step).toPrecision(12)))
  return ticks
}

function ChartTooltip({ point, quote }: { point: ChartPoint | undefined; quote: CurrencyCode }) {
  if (!point) return null

  return (
    <div className="rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm shadow-md dark:border-neutral-700 dark:bg-neutral-800">
      {/* The value leads; the date is secondary. */}
      <p className="font-semibold tabular-nums">
        {formatAmount(point.rate)} {quote}
      </p>
      <p className="text-neutral-600 dark:text-neutral-400">{formatIsoDate(timeToIsoDate(point.time))}</p>
    </div>
  )
}

/** The chart's numbers for screen readers (visually hidden). */
function DataTable({ history: { points, base, quote } }: { history: RateHistory }) {
  return (
    <table className="sr-only">
      <caption>
        Daily rates, 1 {base} in {quote}
      </caption>
      <thead>
        <tr>
          <th scope="col">Date</th>
          <th scope="col">Rate</th>
        </tr>
      </thead>
      <tbody>
        {points.map((point) => (
          <tr key={point.date}>
            <td>{formatIsoDate(point.date)}</td>
            <td>{formatAmount(point.rate)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function Message({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full items-center justify-center px-4 text-center text-sm text-neutral-600 dark:text-neutral-400">
      {children}
    </div>
  )
}

export default RateChart
