import { CalendarIcon } from './icons'
import type { IsoDate } from '../types/rates'
import { addDays, daysBetween, EARLIEST_DATE, type Period } from '../utils/datetime'
import { formatMediumIsoDate } from '../utils/format'

/** Beyond this many days the chart has hundreds of points: warn that it may slow down. */
const LONG_PERIOD_DAYS = 2 * 365

type PeriodPickerProps = {
  period: Period
  /** Latest date allowed (today, in the shown time zone). */
  today: IsoDate
  onChange: (period: Period) => void
}

/**
 * The two calendars under the chart: start date under its left end and end
 * date under its right end, as in the wireframe.
 * Both accept any date from EARLIEST_DATE to today, so neither calendar
 * blocks the other. If a new start falls after the end (or a new end before
 * the start), the other date moves too and the period keeps its length:
 * 30 days ending on Jun 30 start on May 31. The end is never before the start.
 */
function PeriodPicker({ period, today, onChange }: PeriodPickerProps) {
  const length = daysBetween(period.from, period.to)
  const isLong = length > LONG_PERIOD_DAYS

  const changeStart = (from: IsoDate) => {
    if (from <= period.to) return onChange({ from, to: period.to })
    const to = addDays(from, length)
    onChange({ from, to: to > today ? today : to })
  }

  const changeEnd = (to: IsoDate) => {
    if (to >= period.from) return onChange({ from: period.from, to })
    const from = addDays(to, -length)
    onChange({ from: from < EARLIEST_DATE ? EARLIEST_DATE : from, to })
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
      <DateField
        label="Start date"
        value={period.from}
        min={EARLIEST_DATE}
        max={today}
        onChange={changeStart}
      />

      {isLong && (
        // Phones: on its own line below both calendars (order-last + full
        // width). Wider screens: between them.
        <p className="order-last w-full text-center text-xs text-neutral-600 sm:order-none sm:w-auto sm:flex-1 dark:text-neutral-400">
          Long periods load more data and may make the chart slower.
        </p>
      )}

      <DateField
        label="End date"
        // ml-auto: stays on the right even if the line ever wraps.
        className="ml-auto"
        value={period.to}
        min={EARLIEST_DATE}
        max={today}
        onChange={changeEnd}
      />
    </div>
  )
}

type DateFieldProps = {
  label: string
  /** Extra classes from the parent (e.g. to push the end date to the right). */
  className?: string
  value: IsoDate
  min: IsoDate
  max: IsoDate
  onChange: (date: IsoDate) => void
}

/**
 * A native <input type="date"> dressed as a calendar button.
 * Browsers barely let us style the date input itself, so it sits invisible
 * (opacity-0) on top of our own icon and text: clicks and taps land on the
 * real input, which opens the browser's own calendar (showPicker() makes a
 * click anywhere open it on desktop too). It stays focusable and typeable
 * from the keyboard, and screen readers announce it as a date field.
 */
function DateField({ label, value, min, max, onChange, className = '' }: DateFieldProps) {
  return (
    <div className={`relative flex items-center gap-1.5 rounded-md bg-neutral-100 px-2 py-1.5 text-sm hover:bg-neutral-200 sm:gap-2 sm:px-3 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-fuchsia-600 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:has-[:focus-visible]:outline-fuchsia-400 ${className}`}>
      {/* Compact on phones, so both calendars fit on one line. */}
      <CalendarIcon className="size-4 shrink-0 sm:size-5 text-fuchsia-600 dark:text-fuchsia-400" />
      {/* What sighted users read; the input itself carries the label for screen readers. */}
      <span aria-hidden="true" className="tabular-nums">
        {formatMediumIsoDate(value)}
      </span>
      <input
        type="date"
        aria-label={label}
        title={label}
        value={value}
        min={min}
        max={max}
        required
        onChange={(event) => {
          const date = event.target.value
          // Empty (a half-typed date) or out of range: keep the current date.
          if (date && date >= min && date <= max) onChange(date)
        }}
        onClick={(event) => {
          try {
            event.currentTarget.showPicker()
          } catch {
            // Older browsers: the tap or click itself already opens the calendar.
          }
        }}
        // 6px above and below the 32px button: a 44px touch area.
        className="absolute inset-x-0 -inset-y-1.5 cursor-pointer opacity-0"
      />
    </div>
  )
}

export default PeriodPicker
