import {
  formatLongDate,
  formatTime,
  formatUtcOffset,
  getCityName,
} from '../utils/datetime'

type HeaderProps = {
  /** Moment the user made the query. It never changes when the zone changes. */
  queriedAt: Date
  /** IANA time zone used to display that moment. */
  timeZone: string
}

function Header({ queriedAt, timeZone }: HeaderProps) {
  const date = formatLongDate(queriedAt, timeZone)
  const time = formatTime(queriedAt, timeZone)
  const zone = `${formatUtcOffset(queriedAt, timeZone)} (${getCityName(timeZone)})`

  return (
    <header className="mx-auto flex w-full max-w-3xl flex-col gap-2 px-4 py-4 sm:flex-row sm:items-end sm:justify-between">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Pecuniography</h1>

      {/* <time> lets browsers and screen readers read the exact moment. */}
      <time dateTime={queriedAt.toISOString()} className="flex flex-col sm:items-end">
        <span className="text-lg font-semibold">{date}</span>
        <span className="text-neutral-700">
          Time: {time} hrs {zone}
        </span>
      </time>
    </header>
  )
}

export default Header
