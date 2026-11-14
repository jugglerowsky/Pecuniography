import ThemeToggle from './ThemeToggle'
import TimeZoneSelect from './TimeZoneSelect'
import { formatLongDate, formatTime, formatUtcOffset } from '../utils/datetime'
import { getTimeZoneCity } from '../utils/timeZones'

type HeaderProps = {
  /** Moment the user made the query. It never changes when the zone changes. */
  queriedAt: Date
  /** IANA time zone used to display that moment. */
  timeZone: string
  browserTimeZone: string
  onTimeZoneChange: (timeZone: string) => void
  isDark: boolean
  onToggleTheme: () => void
}

function Header({
  queriedAt,
  timeZone,
  browserTimeZone,
  onTimeZoneChange,
  isDark,
  onToggleTheme,
}: HeaderProps) {
  const date = formatLongDate(queriedAt, timeZone)
  const time = formatTime(queriedAt, timeZone)
  const zone = `${formatUtcOffset(queriedAt, timeZone)} (${getTimeZoneCity(timeZone)})`

  return (
    // Grid layout:
    //  - mobile:  [title | switch] on the first row, date and time below.
    //  - desktop: title on the left; switch above date and time on the right.
    <header className="mx-auto grid w-full max-w-3xl grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 px-4 py-4">
      <h1 className="text-4xl font-bold tracking-tight sm:row-span-2 sm:self-end sm:text-5xl">
        Pecuniography
      </h1>

      <div className="justify-self-end">
        <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
      </div>

      {/* `relative` here: the zone list opens below this whole block, aligned
          to its right edge, so it never goes off-screen on phones. */}
      <div className="relative col-span-2 flex items-end gap-2 sm:col-span-1 sm:justify-self-end">
        {/* <time> lets browsers and screen readers read the exact moment. */}
        <time dateTime={queriedAt.toISOString()} className="flex flex-col sm:items-end">
          <span className="text-lg font-semibold">{date}</span>
          <span className="text-neutral-700 dark:text-neutral-300">
            Time: {time} hrs {zone}
          </span>
        </time>

        <TimeZoneSelect
          queriedAt={queriedAt}
          timeZone={timeZone}
          browserTimeZone={browserTimeZone}
          onChange={onTimeZoneChange}
          className="static"
          popupClassName="right-0"
        />
      </div>
    </header>
  )
}

export default Header
